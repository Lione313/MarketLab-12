import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET medicamento por ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const medicamento = await prisma.medicamento.findUnique({
      where: { CodMedicamento: id },
    });

    if (!medicamento) {
      return NextResponse.json({ error: 'Medicamento no encontrado' }, { status: 404 });
    }

    return NextResponse.json(medicamento, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error obteniendo medicamento:', error.message);
    } else {
      console.error('Error desconocido obteniendo medicamento');
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT actualizar medicamento
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const data = await request.json();

    // Opcional: aquí podrías validar los datos recibidos

    const medicamento = await prisma.medicamento.update({
      where: { CodMedicamento: id },
      data,
    });

    return NextResponse.json(medicamento, { status: 200 });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Medicamento no encontrado para actualizar' }, { status: 404 });
    }

    if (error instanceof Error) {
      console.error('Error actualizando medicamento:', error.message);
    } else {
      console.error('Error desconocido actualizando medicamento');
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE medicamento
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await prisma.medicamento.delete({
      where: { CodMedicamento: id },
    });

    return NextResponse.json({ message: 'Medicamento eliminado correctamente' });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as any).code === 'P2003'
    ) {
      // Error de clave foránea
      return NextResponse.json(
        { error: 'Primero debes eliminar el detalle de la compra asociado a este medicamento.' },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      console.error('Error eliminando medicamento:', error.message);
    } else {
      console.error('Error desconocido eliminando medicamento');
    }

    return NextResponse.json({ error: 'Error eliminando medicamento' }, { status: 500 });
  }
}
