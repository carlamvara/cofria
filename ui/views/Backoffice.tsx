import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Menu, CheckCircle, XCircle, Eye, Plus, Edit2, Trash2, Download, FileSpreadsheet, Search } from 'lucide-react';
import { theme } from '../../logic/constants';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AdminSidebar } from './AdminSidebar';
import { weeklyActivityData, messageDistributionData, frequentActionsData, professionsData, COLORS } from '../../services/mockData';

interface BackofficeProps {
  t: any;
}

export const Backoffice: React.FC<BackofficeProps> = ({ t }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeIndexProf, setActiveIndexProf] = useState(-1);
  
  const [users, setUsers] = useState([
    { id: 1, name: 'Carla Vara', email: 'carlamarielvara@gmail.com', status: 'active', sealedMessages: 12, joined: '2026-01-15' },
    { id: 2, name: 'Juan Pérez', email: 'juan.perez@test.com', status: 'active', sealedMessages: 5, joined: '2026-02-10' },
    { id: 3, name: 'Maria Gonzalez', email: 'maria.g@test.com', status: 'inactive', sealedMessages: 0, joined: '2026-03-01' }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 'TX-001', user: 'carlamarielvara@gmail.com', type: 'user', item: 'direct_message', amount: 15.00, method: 'credit_card', date: '2026-03-03 16:05' },
    { id: 'TX-002', user: 'jross@med.com', type: 'professional', item: 'custody_message', amount: 35.00, method: 'wire_transfer', date: '2026-03-02 10:30' },
    { id: 'TX-003', user: 'juan.perez@test.com', type: 'user', item: 'custody_message', amount: 35.00, method: 'credit_card', date: '2026-03-01 14:20' },
    { id: 'TX-004', user: 'ewhite@law.com', type: 'professional', item: 'direct_message', amount: 15.00, method: 'credit_card', date: '2026-02-28 09:15' },
  ]);

  const [professionals, setProfessionals] = useState([
    { id: 1, name: 'Dr. Julian Ross', email: 'jross@med.com', specialty: 'Psicólogo Clínico', license: 'MP-12345', status: 'active' },
    { id: 2, name: 'Dra. Elena White', email: 'ewhite@law.com', specialty: 'Abogada de Familia', license: 'T-45-F-12', status: 'active' },
    { id: 3, name: 'Lic. Marcos Paz', email: 'mpaz@notary.com', specialty: 'Escribano Público', license: 'ESC-998', status: 'active' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: 'carlamarielvara@gmail.com', action: 'Selló mensaje "Para tus 30s"', category: 'sealed_direct', date: '2026-03-03 16:05' },
    { id: 2, user: 'carlamarielvara@gmail.com', action: 'Guardó borrador', category: 'draft_saved', date: '2026-03-03 15:50' },
    { id: 3, user: 'user@test.com', action: 'Sesión iniciada', category: 'login', date: '2026-03-03 14:00' },
    { id: 4, user: 'user@test.com', action: 'Cuenta creada', category: 'account_creation', date: '2026-03-03 13:45' },
    { id: 5, user: 'pro@med.com', action: 'Selló mensaje con custodia', category: 'sealed_custody', date: '2026-03-03 12:30' },
    { id: 6, user: 'pro@med.com', action: 'Sesión finalizada', category: 'logout', date: '2026-03-03 13:15' },
  ]);

  const [bankData, setBankData] = useState({ accountHolder: 'COFRIA S.A.', bankName: 'Global Bank', accountType: 'Corriente', accountNumber: '1234-5678-9012-3456', swift: 'GLBXXX' });
  const [legalContent, setLegalContent] = useState({
    terms: t.legal.termsContent.map((c: any) => `${c.title}\n${c.text}`).join('\n\n'),
    privacy: t.legal.privacyContent.map((c: any) => `${c.title}\n${c.text}`).join('\n\n'),
    security: t.legal.securityContent.map((c: any) => `${c.title}\n${c.text}`).join('\n\n')
  });

  const exportToExcel = async (data: any[], filename: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Auditoría');

    // Define columns
    const columns = Object.keys(data[0]).map(key => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key: key,
      width: 25
    }));
    worksheet.columns = columns;

    // Add data
    worksheet.addRows(data);

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1A233A' } // COFRIA Dark Blue
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Add filters
    worksheet.autoFilter = {
      from: 'A1',
      to: {
        row: 1,
        column: columns.length
      }
    };

    // Conditional formatting for categories (colors)
    data.forEach((row, index) => {
      const rowIndex = index + 2;
      const categoryCell = worksheet.getCell(`C${rowIndex}`); // Assuming Category is 3rd col
      const category = row.category;

      if (category === 'login' || category === 'logout') {
        categoryCell.font = { color: { argb: 'FF2563EB' }, bold: true }; // Blue
      } else if (category === 'account_creation') {
        categoryCell.font = { color: { argb: 'FF059669' }, bold: true }; // Emerald
      } else if (category.includes('sealed')) {
        categoryCell.font = { color: { argb: 'FFD97706' }, bold: true }; // Amber
      }
    });

    // Generate buffer and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}.xlsx`);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const val = row[header] === undefined ? '' : row[header];
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const renderDashboard = () => (
    <>
      <h2 className={`${theme.fontSerif} text-3xl mb-8`}>Panel de Control</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Usuarios Totales</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">1,240</p>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold">+12% vs mes anterior</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Mensajes Sellados</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">850</p>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold">+5.4% vs mes anterior</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Ingresos Totales (USD)</h3>
          <p className="text-4xl font-sans font-bold text-[#C4A166]">$12,450</p>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold">+18.2% vs mes anterior</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Tiempo Promedio</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">12m</p>
          <p className="text-[10px] text-gray-400 mt-2 italic">Estable</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Tasa Conversión</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">68%</p>
          <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{width: '68%'}}></div>
          </div>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Tasa Retención</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">45%</p>
          <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{width: '45%'}}></div>
          </div>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Usuarios Activos</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">342</p>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold">En tiempo real</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Tasa Error</h3>
          <p className="text-4xl font-sans font-bold text-red-400">1.2%</p>
          <p className="text-[10px] text-red-400 mt-2 font-bold">-0.2% mejora</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="h-80 p-6 bg-white border border-[#E5E0D6]">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Actividad Semanal</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#1A233A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-80 p-6 bg-white border border-[#E5E0D6]">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Distribución de Mensajes</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={messageDistributionData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={80} 
                fill="#8884d8" 
                paddingAngle={5} 
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                {messageDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-80 p-6 bg-white border border-[#E5E0D6]">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Profesiones Registradas</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                activeIndex={activeIndexProf}
                activeShape={renderActiveShape}
                data={professionsData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={80} 
                fill="#8884d8" 
                paddingAngle={5} 
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndexProf(index)}
                onMouseLeave={() => setActiveIndexProf(-1)}
              >
                {professionsData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-80 p-6 bg-white border border-[#E5E0D6]">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Acciones Frecuentes</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frequentActionsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" tick={{fontSize: 10}} />
              <Tooltip />
              <Bar dataKey="count" fill="#C4A166" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  const renderAudit = () => (
    <>
      <h2 className={`${theme.fontSerif} text-3xl mb-8`}>Registro de Auditoría</h2>
      <div className="p-6 bg-[#F7F5F0] border border-[#E5E0D6] mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => exportToExcel(auditLogs, 'auditoria')} className="flex items-center gap-2">
            <FileSpreadsheet size={16} /> Excel (Formateado)
          </Button>
          <Button variant="secondary" onClick={() => exportToCSV(auditLogs, 'auditoria')} className="flex items-center gap-2">
            <Download size={16} /> CSV
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar en logs..." 
            className="pl-10 pr-4 py-2 bg-white border border-[#E5E0D6] text-sm focus:outline-none focus:border-[#1A233A] w-64"
          />
        </div>
      </div>
      <div className="p-6 bg-white border border-[#E5E0D6]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-[#F7F5F0]">
              <tr>
                <th className="px-4 py-4">Usuario</th>
                <th className="px-4 py-4">Categoría</th>
                <th className="px-4 py-4">Acción</th>
                <th className="px-4 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-[#1A233A]">{log.user}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      log.category === 'login' || log.category === 'logout' ? 'bg-blue-100 text-blue-700' :
                      log.category === 'account_creation' ? 'bg-emerald-100 text-emerald-700' :
                      log.category.includes('sealed') ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {log.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{log.action}</td>
                  <td className="px-4 py-4 text-gray-400 font-mono text-xs">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderPayments = () => (
    <>
      <h2 className={`${theme.fontSerif} text-3xl mb-8`}>Configuración de Pagos</h2>
      <div className="max-w-xl bg-white p-8 border border-[#E5E0D6]">
        <h3 className="font-bold mb-6 text-sm uppercase tracking-widest">Datos de Cuenta Bancaria</h3>
        <div className="space-y-4">
          <Input label="Titular de la Cuenta" value={bankData.accountHolder} onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})} />
          <Input label="Banco" value={bankData.bankName} onChange={(e) => setBankData({...bankData, bankName: e.target.value})} />
          <Input label="Tipo de Cuenta" value={bankData.accountType} onChange={(e) => setBankData({...bankData, accountType: e.target.value})} />
          <Input label="Número de Cuenta / IBAN" value={bankData.accountNumber} onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})} />
          <Input label="Código SWIFT/BIC" value={bankData.swift} onChange={(e) => setBankData({...bankData, swift: e.target.value})} />
          <div className="pt-4">
            <Button onClick={() => alert('Configuración de pagos guardada')}>Guardar Configuración</Button>
          </div>
        </div>
      </div>
    </>
  );

  const renderLegal = () => (
    <>
      <h2 className={`${theme.fontSerif} text-3xl mb-8`}>Legal y Privacidad</h2>
      <div className="space-y-8">
        <div className="bg-white p-8 border border-[#E5E0D6]">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Términos y Condiciones</h3>
          <textarea 
            className="w-full h-48 p-4 border border-[#E5E0D6] text-sm font-mono focus:outline-none focus:border-[#1A233A]"
            value={legalContent.terms}
            onChange={(e) => setLegalContent({...legalContent, terms: e.target.value})}
          />
        </div>
        <div className="bg-white p-8 border border-[#E5E0D6]">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Política de Privacidad</h3>
          <textarea 
            className="w-full h-48 p-4 border border-[#E5E0D6] text-sm font-mono focus:outline-none focus:border-[#1A233A]"
            value={legalContent.privacy}
            onChange={(e) => setLegalContent({...legalContent, privacy: e.target.value})}
          />
        </div>
        <div className="bg-white p-8 border border-[#E5E0D6]">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Seguridad y Encriptación</h3>
          <textarea 
            className="w-full h-48 p-4 border border-[#E5E0D6] text-sm font-mono focus:outline-none focus:border-[#1A233A]"
            value={legalContent.security}
            onChange={(e) => setLegalContent({...legalContent, security: e.target.value})}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={() => alert('Contenido legal actualizado')}>Publicar Cambios Legales</Button>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <h2 className={`${theme.fontSerif} text-3xl mb-8`}>Gestión de Usuarios</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Usuarios Totales</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">1,240</p>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold">+12% vs mes anterior</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Usuarios Activos (30d)</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">850</p>
          <p className="text-[10px] text-gray-500 mt-2 italic">68% del total</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Nuevos (Este Mes)</h3>
          <p className="text-4xl font-sans font-bold text-[#C4A166]">145</p>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold">+5% vs mes anterior</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => exportToExcel(users, 'usuarios')} className="flex items-center gap-2">
            <FileSpreadsheet size={16} /> Excel (Formateado)
          </Button>
          <Button variant="secondary" onClick={() => exportToCSV(users, 'usuarios')} className="flex items-center gap-2">
            <Download size={16} /> CSV
          </Button>
        </div>
      </div>
      
      <div className="p-6 bg-white border border-[#E5E0D6]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-[#F7F5F0]">
              <tr>
                <th className="px-4 py-4">Nombre</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Mensajes Sellados</th>
                <th className="px-4 py-4">Fecha Registro</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-[#1A233A]">{user.name}</td>
                  <td className="px-4 py-4 text-gray-500">{user.email}</td>
                  <td className="px-4 py-4 font-mono text-center">{user.sealedMessages}</td>
                  <td className="px-4 py-4 font-mono text-xs text-gray-500">{user.joined}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-[#1A233A] transition-colors" title="Ver"><Eye size={16} /></button>
                      <button className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 size={16} /></button>
                      <button 
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Eliminar"
                        onClick={() => {
                          if(confirm('¿Está seguro de eliminar este usuario?')) {
                            setUsers(users.filter(u => u.id !== user.id));
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderTransactions = () => (
    <>
      <h2 className={`${theme.fontSerif} text-3xl mb-8`}>Transacciones</h2>
      
      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Ingresos (Mes Actual)</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">$12,450</p>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold">+18.2% vs mes anterior</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Ingresos (Mes Anterior)</h3>
          <p className="text-4xl font-sans font-bold text-gray-400">$10,530</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Ingresos (Mismo Mes Año Ant.)</h3>
          <p className="text-4xl font-sans font-bold text-gray-400">$8,200</p>
        </div>
      </div>

      {/* Semester Stats */}
      {/* Semestre 1: Ene 1 - Jun 30 | Semestre 2: Jul 1 - Dic 31 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-[#F7F5F0] border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Ingresos (Semestre Actual)</h3>
          <p className="text-3xl font-sans font-bold text-[#1A233A]">$68,450</p>
          <p className="text-[10px] text-gray-500 mt-2 italic">01 Ene - 30 Jun</p>
        </div>
        <div className="p-6 bg-[#F7F5F0] border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Ingresos (Semestre Anterior)</h3>
          <p className="text-3xl font-sans font-bold text-gray-400">$54,200</p>
          <p className="text-[10px] text-gray-500 mt-2 italic">01 Jul - 31 Dic (Año Pasado)</p>
        </div>
        <div className="p-6 bg-[#F7F5F0] border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Ingresos (Mismo Sem. Año Ant.)</h3>
          <p className="text-3xl font-sans font-bold text-gray-400">$42,100</p>
          <p className="text-[10px] text-gray-500 mt-2 italic">01 Ene - 30 Jun (Año Pasado)</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Buscar transacción..." className="pl-10 pr-4 py-2 bg-white border border-[#E5E0D6] text-sm focus:outline-none focus:border-[#1A233A] w-64" />
            </div>
            <select className="px-4 py-2 bg-white border border-[#E5E0D6] text-sm focus:outline-none focus:border-[#1A233A]">
                <option value="all">Todos los Usuarios</option>
                <option value="user">Remitentes</option>
                <option value="professional">Profesionales</option>
            </select>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => exportToExcel(transactions, 'transacciones')} className="flex items-center gap-2">
            <FileSpreadsheet size={16} /> Excel
          </Button>
          <Button variant="secondary" onClick={() => exportToCSV(transactions, 'transacciones')} className="flex items-center gap-2">
            <Download size={16} /> CSV
          </Button>
        </div>
      </div>

      <div className="p-6 bg-white border border-[#E5E0D6]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-[#F7F5F0]">
              <tr>
                <th className="px-4 py-4">ID Transacción</th>
                <th className="px-4 py-4">Usuario</th>
                <th className="px-4 py-4">Tipo Usuario</th>
                <th className="px-4 py-4">Concepto</th>
                <th className="px-4 py-4">Método</th>
                <th className="px-4 py-4">Fecha</th>
                <th className="px-4 py-4 text-right">Monto (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-mono text-xs text-gray-500">{tx.id}</td>
                  <td className="px-4 py-4 font-medium text-[#1A233A]">{tx.user}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      tx.type === 'professional' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tx.type === 'professional' ? 'Profesional' : 'Remitente'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600 capitalize">{tx.item.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-4 text-xs text-gray-500 capitalize">{tx.method.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-4 font-mono text-xs text-gray-500">{tx.date}</td>
                  <td className="px-4 py-4 text-right font-bold text-[#1A233A]">${tx.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderProfessionals = () => (
    <>
      <h2 className={`${theme.fontSerif} text-3xl mb-8`}>Gestión de Profesionales</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Profesionales Totales</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">48</p>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold">+2 este mes</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Activos (30d)</h3>
          <p className="text-4xl font-sans font-bold text-[#1A233A]">32</p>
          <p className="text-[10px] text-gray-500 mt-2 italic">66% del total</p>
        </div>
        <div className="p-6 bg-white border border-[#E5E0D6] shadow-sm">
          <h3 className="font-bold mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Verificados</h3>
          <p className="text-4xl font-sans font-bold text-[#C4A166]">45</p>
          <p className="text-[10px] text-gray-500 mt-2 italic">93% cumplimiento</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => exportToExcel(professionals, 'profesionales')} className="flex items-center gap-2">
            <FileSpreadsheet size={16} /> Excel (Formateado)
          </Button>
          <Button variant="secondary" onClick={() => exportToCSV(professionals, 'profesionales')} className="flex items-center gap-2">
            <Download size={16} /> CSV
          </Button>
          <Button onClick={() => alert('Abrir modal de creación')} className="flex items-center gap-2">
            <Plus size={16} /> Nuevo Profesional
          </Button>
        </div>
      </div>
      
      <div className="p-6 bg-white border border-[#E5E0D6]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-[#F7F5F0]">
              <tr>
                <th className="px-4 py-4">Nombre</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Especialidad</th>
                <th className="px-4 py-4">Licencia</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {professionals.map((prof) => (
                <tr key={prof.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-[#1A233A]">{prof.name}</td>
                  <td className="px-4 py-4 text-gray-500">{prof.email}</td>
                  <td className="px-4 py-4 text-gray-600">{prof.specialty}</td>
                  <td className="px-4 py-4 font-mono text-xs">{prof.license}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      prof.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {prof.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-[#1A233A] transition-colors" title="Ver"><Eye size={16} /></button>
                      <button className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 size={16} /></button>
                      <button 
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Eliminar"
                        onClick={() => {
                          if(confirm('¿Está seguro de eliminar este profesional?')) {
                            setProfessionals(professionals.filter(p => p.id !== prof.id));
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen flex ${theme.bg}`}>
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} t={t} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#1A233A] text-white p-4 flex items-center justify-end sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'users' && renderUsers()}
            {activeView === 'professionals' && renderProfessionals()}
            {activeView === 'transactions' && renderTransactions()}
            {activeView === 'audit' && renderAudit()}
            {activeView === 'payments' && renderPayments()}
            {activeView === 'legal' && renderLegal()}
          </div>
        </main>
      </div>
    </div>
  );
};
