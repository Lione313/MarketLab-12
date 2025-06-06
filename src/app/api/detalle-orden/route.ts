import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all detalles de orden
export async function GET() {
  try {
    const detalles = await prisma.detalleOrdenCompra.findMany();
    return NextResponse.json(detalles, { status: 200 });
  } catch (error) {
    console.error('Error fetching detalleOrdenCompra:', error);
    return NextResponse.json({ error: 'Error fetching detalles' }, { status: 500 });
  }
}

// POST create detalle de orden
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validar campos básicos
    if (
      !data.descripcion ||
      typeof data.cantidad !== 'number' ||
      typeof data.precio !== 'number' ||
      typeof data.montouni !== 'number' ||
      typeof data.CodMedicamento !== 'number'
    ) {
      return NextResponse.json({ error: 'Datos incompletos o inválidos' }, { status: 400 });
    }

    const detalle = await prisma.detalleOrdenCompra.create({
      data: {
        descripcion: data.descripcion,
        cantidad: data.cantidad,
        precio: data.precio,
        montouni: data.montouni,
        CodMedicamento: data.CodMedicamento,
      },
    });

    return NextResponse.json(detalle, { status: 201 });
  } catch (error) {
    console.error('Error creando detalle orden:', error);
    return NextResponse.json({ error: 'Error creando detalle orden' }, { status: 500 });
  }
}

