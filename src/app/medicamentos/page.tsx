'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Medicamento {
  CodMedicamento: number;
  descripcionMed: string;
  fechaFabricacion: string;
  fechaVencimiento: string;
  presentacion: string;
  stock: number;
  precioVentaUni: number;
  precioVentaPres: number;
  marca: string;
}

export default function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  const [nuevoMed, setNuevoMed] = useState({
    descripcionMed: '',
    fechaFabricacion: '',
    fechaVencimiento: '',
    presentacion: '',
    stock: 0,
    precioVentaUni: 0,
    precioVentaPres: 0,
    marca: '',
  });
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
const [medicamentoToDelete, setMedicamentoToDelete] = useState<number | null>(null);

const abrirModalEliminar = (cod: number) => {
  setMedicamentoToDelete(cod);
  setModalDeleteOpen(true);
};


  // Estado para medicamento que se está editando
  const [medEdit, setMedEdit] = useState<Medicamento | null>(null);

  useEffect(() => {
  fetch('/api/medicamentos')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setMedicamentos(data);
      } else {
        // Si no es array, asigna array vacío o maneja el error
        setMedicamentos([]);
        console.error('Datos recibidos no son un array:', data);
      }
    })
    .catch(error => {
      setMedicamentos([]);
      console.error('Error al obtener medicamentos:', error);
    });
}, []);


 const confirmarEliminarMedicamento = async () => {
  if (medicamentoToDelete === null) return;

  try {
    const res = await fetch(`/api/medicamentos/${medicamentoToDelete}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (res.ok) {
      setMedicamentos(medicamentos.filter(med => med.CodMedicamento !== medicamentoToDelete));
      toast.success('Medicamento eliminado');
    } else {
      // Aquí puedes mostrar el mensaje específico del backend
      toast.error(data.error || 'Error al eliminar medicamento');
    }
  } catch {
    toast.error('Error en la conexión o servidor');
  } finally {
    setModalDeleteOpen(false);
    setMedicamentoToDelete(null);
  }
};



  // Abrir modal de edición y cargar datos desde API
  const editarMedicamento = async (med: Medicamento) => {
    try {
      const res = await fetch(`/api/medicamentos/${med.CodMedicamento}`);
      if (!res.ok) {
        alert('Error cargando medicamento');
        return;
      }
      const data = await res.json();
      setMedEdit(data);
      setModalEditOpen(true);
    } catch (error) {
      alert('Error al cargar medicamento para editar');
    }
  };

  // Manejar actualización del medicamento editado
 const actualizarMedicamento = async () => {
  if (!medEdit) return;

  // Validación básica igual que para crear
  if (
    !medEdit.descripcionMed ||
    !medEdit.fechaFabricacion ||
    !medEdit.fechaVencimiento ||
    !medEdit.presentacion ||
    !medEdit.marca ||
    medEdit.stock <= 0 ||
    medEdit.precioVentaUni <= 0 ||
    medEdit.precioVentaPres <= 0
  ) {
    toast.error('Por favor, completa todos los campos correctamente');
    return;
  }

  try {
    const res = await fetch(`/api/medicamentos/${medEdit.CodMedicamento}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medEdit),
    });

    if (res.ok) {
      const data = await res.json();
      setMedicamentos(medicamentos.map(med => (med.CodMedicamento === data.CodMedicamento ? data : med)));
      setModalEditOpen(false);
      toast.success('Medicamento actualizado');
    } else {
      toast.error('Error al actualizar medicamento');
    }
  } catch (error) {
    toast.error('Error en la conexión o servidor');
  }
};

  


  const crearMedicamento = async () => {
    if (
      !nuevoMed.descripcionMed ||
      !nuevoMed.fechaFabricacion ||
      !nuevoMed.fechaVencimiento ||
      !nuevoMed.presentacion ||
      !nuevoMed.marca ||
      nuevoMed.stock <= 0 ||
      nuevoMed.precioVentaUni <= 0 ||
      nuevoMed.precioVentaPres <= 0
    ) {
      alert('Por favor, completa todos los campos correctamente');
      return;
    }

    const res = await fetch('/api/medicamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoMed),
    });

    if (res.ok) {
      const data = await res.json();
      setMedicamentos([...medicamentos, data]);
      setNuevoMed({
        descripcionMed: '',
        fechaFabricacion: '',
        fechaVencimiento: '',
        presentacion: '',
        stock: 0,
        precioVentaUni: 0,
        precioVentaPres: 0,
        marca: '',
      });
      setModalOpen(false);
      alert('Medicamento creado');
    } else {
      alert('Error al crear medicamento');
    }
  };

  return (
    <div>
            <ToastContainer 
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnHover
  draggable
  theme="colored"
/>
      <motion.h2
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl md:text-4xl font-extrabold text-center mt-10 mb-12 
                   font-sans tracking-wide text-gray-900 drop-shadow-md"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Lista de Medicamentos
      </motion.h2>

     <div className="flex justify-center mb-10">
  <button
    onClick={() => setModalOpen(true)}
    className="px-6 py-3 rounded-2xl border border-black bg-white text-black font-semibold transition duration-300 ease-in-out 
               hover:bg-black hover:text-white 
               hover:shadow-[0_0_10px_2px_rgba(255,192,203,0.4),0_0_20px_4px_rgba(255,255,153,0.4),0_0_30px_6px_rgba(144,238,144,0.4),0_0_40px_8px_rgba(173,216,230,0.4)]"
  >
    Crear un Nuevo Medicamento
  </button>
</div>



      {/* Modal Crear */}
      {modalOpen && (
  <>
    {/* Fondo difuminado con blur */}
    <div className="fixed inset-0 z-40 bg-white/40 backdrop-blur-[4px]" />


    {/* Modal */}
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative overflow-auto max-h-[90vh]">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Crear nuevo medicamento</h3>
        <form
  onSubmit={(e) => {
    e.preventDefault();
    crearMedicamento();
  }}
  className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-6 gap-y-5"
>
    

          {/* Labels e inputs mejorados */}
          <label htmlFor="descripcionMed" className="self-center text-gray-700 font-medium">
            Descripción
          </label>
          <input
            id="descripcionMed"
            type="text"
            value={nuevoMed.descripcionMed}
            onChange={(e) => setNuevoMed({ ...nuevoMed, descripcionMed: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          {/* Repetir para los demás campos... */}
          <label htmlFor="fechaFabricacion" className="self-center text-gray-700 font-medium">
            Fecha Fabricación
          </label>
          <input
            id="fechaFabricacion"
            type="date"
            value={nuevoMed.fechaFabricacion}
            onChange={(e) => setNuevoMed({ ...nuevoMed, fechaFabricacion: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <label htmlFor="fechaVencimiento" className="self-center text-gray-700 font-medium">
            Fecha Vencimiento
          </label>
          <input
            id="fechaVencimiento"
            type="date"
            value={nuevoMed.fechaVencimiento}
            onChange={(e) => setNuevoMed({ ...nuevoMed, fechaVencimiento: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <label htmlFor="presentacion" className="self-center text-gray-700 font-medium">
            Presentación
          </label>
          <input
            id="presentacion"
            type="text"
            value={nuevoMed.presentacion}
            onChange={(e) => setNuevoMed({ ...nuevoMed, presentacion: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <label htmlFor="stock" className="self-center text-gray-700 font-medium">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            min={0}
            value={nuevoMed.stock}
            onChange={(e) => setNuevoMed({ ...nuevoMed, stock: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <label htmlFor="precioVentaUni" className="self-center text-gray-700 font-medium">
            Precio Unitario
          </label>
          <input
            id="precioVentaUni"
            type="number"
            min={0}
            step="0.01"
            value={nuevoMed.precioVentaUni}
            onChange={(e) => setNuevoMed({ ...nuevoMed, precioVentaUni: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <label htmlFor="precioVentaPres" className="self-center text-gray-700 font-medium">
            Precio Presentación
          </label>
          <input
            id="precioVentaPres"
            type="number"
            min={0}
            step="0.01"
            value={nuevoMed.precioVentaPres}
            onChange={(e) => setNuevoMed({ ...nuevoMed, precioVentaPres: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <label htmlFor="marca" className="self-center text-gray-700 font-medium">
            Marca
          </label>
          <input
            id="marca"
            type="text"
            value={nuevoMed.marca}
            onChange={(e) => setNuevoMed({ ...nuevoMed, marca: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-gradient-to-r hover:from-blue-400 hover:via-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg transition"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
)}

{modalEditOpen && medEdit && (
  <>
    {/* Fondo blur con overlay blanco semitransparente */}
    <div className="fixed inset-0 bg-white/40 backdrop-blur-[4px] z-40" />

    {/* Modal */}
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-xl max-h-[95vh] overflow-y-auto">

        <h3 className="text-2xl font-semibold mb-6 text-center font-sans tracking-wide text-gray-800">
          Editar medicamento
        </h3>

        <form
          onSubmit={e => {
            e.preventDefault();
            actualizarMedicamento();
          }}
          className="space-y-4"
        >
          {/* CAMPO: Descripción */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="descripcionMedEdit" className="font-medium text-gray-700 w-full sm:w-40">Descripción</label>
            <input
              id="descripcionMedEdit"
              type="text"
              value={medEdit.descripcionMed}
              onChange={e => setMedEdit({ ...medEdit, descripcionMed: e.target.value })}
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* CAMPO: Fecha Fabricación */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="fechaFabricacionEdit" className="font-medium text-gray-700 w-full sm:w-40">Fecha Fabricación</label>
            <input
              id="fechaFabricacionEdit"
              type="date"
              value={medEdit.fechaFabricacion.split('T')[0] ?? medEdit.fechaFabricacion}
              onChange={e => setMedEdit({ ...medEdit, fechaFabricacion: e.target.value })}
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* CAMPO: Fecha Vencimiento */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="fechaVencimientoEdit" className="font-medium text-gray-700 w-full sm:w-40">Fecha Vencimiento</label>
            <input
              id="fechaVencimientoEdit"
              type="date"
              value={medEdit.fechaVencimiento.split('T')[0] ?? medEdit.fechaVencimiento}
              onChange={e => setMedEdit({ ...medEdit, fechaVencimiento: e.target.value })}
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* CAMPO: Presentación */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="presentacionEdit" className="font-medium text-gray-700 w-full sm:w-40">Presentación</label>
            <input
              id="presentacionEdit"
              type="text"
              value={medEdit.presentacion}
              onChange={e => setMedEdit({ ...medEdit, presentacion: e.target.value })}
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* CAMPO: Stock */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="stockEdit" className="font-medium text-gray-700 w-full sm:w-40">Stock</label>
            <input
              id="stockEdit"
              type="number"
              min={0}
              value={medEdit.stock}
              onChange={e => setMedEdit({ ...medEdit, stock: Number(e.target.value) })}
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* CAMPO: Precio Unitario */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="precioVentaUniEdit" className="font-medium text-gray-700 w-full sm:w-40">Precio Unitario</label>
            <input
              id="precioVentaUniEdit"
              type="number"
              min={0}
              step="0.01"
              value={medEdit.precioVentaUni}
              onChange={e => setMedEdit({ ...medEdit, precioVentaUni: Number(e.target.value) })}
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* CAMPO: Precio Presentación */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="precioVentaPresEdit" className="font-medium text-gray-700 w-full sm:w-40">Precio Presentación</label>
            <input
              id="precioVentaPresEdit"
              type="number"
              min={0}
              step="0.01"
              value={medEdit.precioVentaPres}
              onChange={e => setMedEdit({ ...medEdit, precioVentaPres: Number(e.target.value) })}
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* CAMPO: Marca */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="marcaEdit" className="font-medium text-gray-700 w-full sm:w-40">Marca</label>
            <input
              id="marcaEdit"
              type="text"
              value={medEdit.marca}
              onChange={e => setMedEdit({ ...medEdit, marca: e.target.value })}
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => setModalEditOpen(false)}
              className="w-full sm:w-auto px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-gradient-to-r hover:from-blue-400 hover:via-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg transition"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
)}




    <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-md">
  <table className="min-w-full border-separate border-spacing-0 w-full text-left">
    <thead className="bg-black text-white select-none">
      <tr>
        {['Descripción', 'Fecha Fab.', 'Fecha Ven.', 'Presentación', 'Stock', 'Precio Uni.', 'Precio Pres.', 'Marca', 'Acciones'].map((head) => (
          <th key={head} className="p-3 font-semibold text-sm uppercase tracking-wide border-b border-black">
            {head}
          </th>
        ))}
      </tr>
    </thead>
<tbody>
  {medicamentos.length === 0 ? (
    <tr>
    <td colSpan={9} className="text-center p-3">

        No hay medicamentos disponibles.
      </td>
    </tr>
  ) : (
    medicamentos.map((med, idx) => (
      <tr
        key={med.CodMedicamento}
        className={`bg-white ${idx % 2 === 0 ? 'bg-blue-50' : ''} hover:bg-blue-100 transition-colors duration-300 cursor-pointer`}
      >
        <td className="p-3 border-b border-black">{med.descripcionMed}</td>
        <td className="p-3 border-b border-black">{med.fechaFabricacion.split('T')[0]}</td>
        <td className="p-3 border-b border-black">{med.fechaVencimiento.split('T')[0]}</td>
        <td className="p-3 border-b border-black">{med.presentacion}</td>
        <td className="p-3 border-b border-black text-center">{med.stock}</td>
        <td className="p-3 border-b border-black text-right">${med.precioVentaUni.toFixed(2)}</td>
        <td className="p-3 border-b border-black text-right">${med.precioVentaPres.toFixed(2)}</td>
        <td className="p-3 border-b border-black">{med.marca}</td>
        <td className="p-3 border-b border-black flex gap-2 justify-center">
          <button
            onClick={() => editarMedicamento(med)}
            className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md shadow-md transition"
            aria-label="Editar medicamento"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17h2m-6 4h12a2 2 0 002-2v-5a2 2 0 00-2-2h-3l-2-2H7v9a2 2 0 002 2z" />
            </svg>
            Editar
          </button>
          <button
            onClick={() => abrirModalEliminar(med.CodMedicamento)}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-md transition"
            aria-label="Eliminar medicamento"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Eliminar
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

  </table>
  {modalDeleteOpen && (
  <div className="fixed inset-0 bg-white/40 backdrop-blur-[4px flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
      <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
      <p className="mb-6">¿Estás seguro de que deseas eliminar este medicamento?</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => {
            setModalDeleteOpen(false);
            setMedicamentoToDelete(null);
          }}
          className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={confirmarEliminarMedicamento}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}

</div>

    </div>
  );
}
