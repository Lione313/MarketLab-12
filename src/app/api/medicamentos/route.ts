import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all medicamentos
export async function GET() {
  try {
    const medicamentos = await prisma.medicamento.findMany();
    return NextResponse.json(medicamentos, { status: 200 });
  } catch (error) {
    console.error('Error fetching medicamentos:', error);
    return NextResponse.json({ error: 'Error fetching medicamentos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validar campos básicos (puedes expandir según tu esquema)
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

    // Convertir fechas a ISO-8601
    data.fechaFabricacion = new Date(data.fechaFabricacion).toISOString();
    data.fechaVencimiento = new Date(data.fechaVencimiento).toISOString();

    // Crear nuevo medicamento
    const nuevo = await prisma.medicamento.create({ data });

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error('Error creando medicamento:', error);
    return NextResponse.json({ error: 'Error creando medicamento' }, { status: 500 });
  }
}

