'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { motion } from "framer-motion";
import { Edit, Trash2, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Detalle {
  id: number;
  descripcion: string;
  cantidad: number;
  precio: number;
  montouni: number;
  CodMedicamento: number | string;
}

interface FormData {
  id: number | null;
  descripcion: string;
  cantidad: number;
  precio: number;
  montouni: number;
  CodMedicamento: number | string;
}

interface Medicamento {
  CodMedicamento: number | string;
  presentacion: string;
}

export default function DetalleCompra() {
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: null,
    descripcion: '',
    cantidad: 1,
    precio: 0,
    montouni: 0,
    CodMedicamento: '',
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [deleteId, setDeleteId] = useState<number | null>(null);

function openDeleteModal(id: number) {
  setDeleteId(id);
  setDeleteModalOpen(true);
}

function cancelDelete() {
  setDeleteModalOpen(false);
  setDeleteId(null);
}


  // Cargar detalles y medicamentos al inicio
  useEffect(() => {
  let isMounted = true;
  
  fetch('/api/detalle-orden')
    .then(res => res.json())
    .then(data => { if(isMounted) setDetalles(data); })
    .catch(console.error);

  fetch('/api/medicamentos')
    .then(res => res.json())
    .then(data => { if(isMounted) setMedicamentos(data); })
    .catch(console.error);

  return () => { isMounted = false; };
}, []);

  function openModal(detalle: Detalle | null = null) {
    if (detalle) {
      setFormData({
        id: detalle.id,
        descripcion: detalle.descripcion,
        cantidad: detalle.cantidad,
        precio: detalle.precio,
        montouni: detalle.montouni,
        CodMedicamento: detalle.CodMedicamento,
      });
    } else {
      setFormData({
        id: null,
        descripcion: '',
        cantidad: 1,
        precio: 0,
        montouni: 0,
        CodMedicamento: '',
      });
    }
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }
  function confirmDelete() {
  if (deleteId === null) return;

  fetch(`/api/detalle-orden/${deleteId}`, {
    method: 'DELETE',
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al eliminar el detalle');
      setDetalles(prev => prev.filter(det => det.id !== deleteId));
      toast.success('Detalle eliminado correctamente');
    })
    .catch(err => {
      toast.error('Error al eliminar: ' + err.message);
    })
    .finally(() => {
      setDeleteModalOpen(false);
      setDeleteId(null);
    });
}



  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  const { name, value } = e.target;

  setFormData(prev => {
    let newValue: string | number = value;

    if (name === 'cantidad' || name === 'precio') {
      newValue = Number(value);
    }

    // ✅ Conversión correcta del select a número
    if (name === 'CodMedicamento') {
      newValue = Number(value);
    }

    let newMontouni = prev.montouni;
    if (name === 'cantidad' || name === 'precio') {
      const cantidad = name === 'cantidad' ? Number(newValue) : prev.cantidad;
      const precio = name === 'precio' ? Number(newValue) : prev.precio;
      newMontouni = cantidad * precio;
    }

    return {
      ...prev,
      [name]: newValue,
      montouni: newMontouni,
    };
  });
}


  function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const url = formData.id ? `/api/detalle-orden/${formData.id}` : '/api/detalle-orden';
  const method = formData.id ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then(async (res) => {
      if (!res.ok) {
        // Intentamos leer el mensaje de error del backend
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Error en la respuesta de la API';
        throw new Error(errorMessage);
      }
      return res.json();
    })
    .then(data => {
      if (formData.id) {
        setDetalles(prev => prev.map(d => (d.id === data.id ? data : d)));
        toast.success('Detalle actualizado con éxito');
      } else {
        setDetalles(prev => [...prev, data]);
        toast.success('Detalle creado con éxito');
      }
      closeModal();
    })
    .catch(err => {
      toast.error('Error al guardar: ' + err.message);
    });
}

  return (
    <div className="p-4">
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
        Detalles del medicamento
      </motion.h2>
     
      <div className="flex justify-center mb-10">
  <button
    onClick={() => openModal(null)}
    className="px-6 py-3 rounded-2xl border border-black bg-white text-black font-semibold transition duration-300 ease-in-out 
               hover:bg-black hover:text-white 
               hover:shadow-[0_0_10px_2px_rgba(255,192,203,0.4),0_0_20px_4px_rgba(255,255,153,0.4),0_0_30px_6px_rgba(144,238,144,0.4),0_0_40px_8px_rgba(173,216,230,0.4)]"
  >
    Crear nuevo detalle
  </button>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
  {detalles.map((item) => (
    <div
      key={item.id}
      className="relative border p-5 rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{item.descripcion}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => openModal(item)}
            className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => openDeleteModal(item.id)}
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-gray-700">Cantidad: {item.cantidad}</p>
      <p className="text-gray-700">Precio unitario: S/ {item.precio}</p>
      <p className="text-gray-700 font-medium">Total: S/ {item.montouni}</p>
      <p className="text-sm text-gray-500 mt-3">CodMedicamento: {item.CodMedicamento}</p>
    </div>
  ))}
</div>

      {modalOpen && (
  <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm px-4">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative animate-fade-in-up">
      {/* Botón cerrar */}
      <button
        onClick={closeModal}
        className="absolute top-3 right-3 text-gray-600 hover:text-red-600 transition-colors"
        aria-label="Cerrar modal"
      >
        <X size={20} />
      </button>

      {/* Título */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {formData.id ? 'Editar detalle' : 'Crear detalle'}
      </h3>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium mb-1">
            Descripción:
          </label>
          <input
            id="descripcion"
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium mb-1">
            Cantidad:
          </label>
          <input
            id="cantidad"
            type="number"
            name="cantidad"
            min={1}
            value={formData.cantidad}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="precio" className="block text-sm font-medium mb-1">
            Precio unitario:
          </label>
          <input
            id="precio"
            type="number"
            name="precio"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="montouni" className="block text-sm font-medium mb-1">
            Monto total:
          </label>
          <input
            id="montouni"
            type="number"
            name="montouni"
            value={formData.montouni}
            readOnly
            className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="CodMedicamento" className="block text-sm font-medium mb-1">
            Medicamento:
          </label>
          <select
            id="CodMedicamento"
            name="CodMedicamento"
            value={formData.CodMedicamento}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un medicamento</option>
            {medicamentos.map((med) => (
              <option key={med.CodMedicamento} value={med.CodMedicamento}>
                {med.presentacion}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
        >
          {formData.id ? 'Actualizar detalle' : 'Crear detalle'}
        </button>
      </form>
    </div>
  </div>
)}
{deleteModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[4px] z-50">
    <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
      <h3 className="text-xl font-semibold mb-4">¿Estás seguro de eliminar este detalle?</h3>
      <p className="mb-6">Esta acción no se puede deshacer.</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={cancelDelete}
          className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
