import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all medicamentos
export async function GET() {
  try {
    const medicamentos = await prisma.medicamento.findMany();
    return NextResponse.json(medicamentos, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching medicamentos:', error.message);
    } else {
      console.error('Error desconocido fetching medicamentos');
    }
    return NextResponse.json({ error: 'Error fetching medicamentos' }, { status: 500 });
  }
}

// POST crear nuevo medicamento
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validar campos básicos (puedes ampliar según tu modelo)
    if (
      !data.descripcionMed ||
      !data.fechaFabricacion ||
      !data.fechaVencimiento ||
      !data.presentacion ||
      typeof data.stock !== 'number' ||
      typeof data.precioVentaUni !== 'number' ||
      typeof data.precioVentaPres !== 'number' ||
      !data.marca
    ) {
      return NextResponse.json({ error: 'Datos incompletos o inválidos' }, { status: 400 });
    }

    // Validar fechas y convertir a ISO
    const fechaFab = new Date(data.fechaFabricacion);
    const fechaVen = new Date(data.fechaVencimiento);
    if (isNaN(fechaFab.getTime()) || isNaN(fechaVen.getTime())) {
      return NextResponse.json({ error: 'Fechas inválidas' }, { status: 400 });
    }
    data.fechaFabricacion = fechaFab.toISOString();
    data.fechaVencimiento = fechaVen.toISOString();

    // Crear nuevo medicamento
    const nuevo = await prisma.medicamento.create({ data });

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creando medicamento:', error.message);
    } else {
      console.error('Error desconocido creando medicamento');
    }
    return NextResponse.json({ error: 'Error creando medicamento' }, { status: 500 });
  }
}
