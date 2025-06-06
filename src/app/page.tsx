"use client";

import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <img
          src="https://png.pngtree.com/png-clipart/20211014/ourlarge/pngtree-pharmacy-flat-style-illustration-store-png-image_3976445.png"
          alt="Farmacia"
          className="absolute inset-0 h-full w-full object-cover brightness-75"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold drop-shadow-lg"
          >
            MarketLab
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-lg md:text-xl max-w-2xl"
          >
            La plataforma moderna para el control y gestión de medicamentos en tiempo real.
          </motion.p>
        </div>
      </section>

      {/* CARRUSEL DE IMÁGENES */}
      <section className="my-12 px-4 md:px-12 lg:px-24">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          ¿Qué puedes hacer con MarketLab?
        </h2>
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={4000}
          showStatus={false}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {[
            {
              src: "https://w7.pngwing.com/pngs/995/137/png-transparent-inventory-management-software-inventory-control-cartoon-inventory-management-service-public-relations-cartoon.png",
              caption: "Controla tu inventario al instante",
            },
            {
              src: "https://w7.pngwing.com/pngs/545/568/png-transparent-shopping-illustration-shopping-cart-coffee-shop-shopping-mall-cartoon.png",
              caption: "Registra compras fácilmente",
            },
            {
              src: "https://w7.pngwing.com/pngs/413/879/png-transparent-auditor-s-report-internal-audit-financial-statement-assurance-services-report-company-text-service-thumbnail.png",
              caption: "Visualiza métricas y reportes",
            },
          ].map((item, i) => (
            <div key={i}>
              <img src={item.src} alt={item.caption} className="object-cover h-[400px] w-full" />
              <p className="legend text-base">{item.caption}</p>
            </div>
          ))}
        </Carousel>
      </section>

<section className="px-4 md:px-12 lg:px-24 py-12 text-center">
  <h2 className="text-3xl font-bold text-gray-800 mb-10">
    Funcionalidades principales
  </h2>
  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {[
      {
        title: "Gestión de Medicamentos",
        desc: "Administra tu inventario con facilidad. Agrega, edita y elimina productos.",
        icon: "💊",
        bg: "https://cdn-icons-png.flaticon.com/512/554/554733.png",
      },
      {
        title: "Detalle de Compras",
        desc: "Registra todas las órdenes de compra con precisión y control.",
        icon: "🧾",
        bg: "https://cdn-icons-png.flaticon.com/512/1170/1170627.png",
      },
      {
        title: "Dashboard Visual",
        desc: "Gráficos, métricas y seguimiento de operaciones en tiempo real.",
        icon: "📊",
        bg: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
      },
      {
        title: "Acceso Seguro",
        desc: "Protege los datos con login seguro y control de sesiones.",
        icon: "🔒",
        bg: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
      },
      {
        title: "Sincronización Instantánea",
        desc: "Actualización automática sin necesidad de recargar la página.",
        icon: "⚡",
        bg: "https://cdn-icons-png.flaticon.com/512/4270/4270834.png",
      },
      {
        title: "Soporte 24/7",
        desc: "Contamos con un equipo listo para ayudarte siempre.",
        icon: "🛠️",
        bg: "https://cdn-icons-png.flaticon.com/512/2830/2830280.png",
      },
    ].map((card, i) => (
      <motion.div
  key={card.title}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: i * 0.15 }}
  className="transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-4 hover:shadow-2xl bg-white rounded-2xl p-6 text-left border-t-4 border-red-600 relative overflow-hidden group h-[300px] md:h-[350px] flex flex-col justify-between"
  style={{ perspective: "1000px" }}
>
  {/* Fondo con imagen ajustada */}
  <div
    className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 bg-white"
    style={{ backgroundImage: `url(${card.bg})` }}
  />

  <div className="relative z-10 group-hover:text-red-800 transition-colors duration-300">
    <div className="text-4xl mb-4">{card.icon}</div>
    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
    <p>{card.desc}</p>
  </div>
</motion.div>

    ))}
  </div>
</section>



      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-8">
        © {new Date().getFullYear()} MarketLab. Todos los derechos reservados.
      </footer>
    </div>
  );
}
