import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);
  const data = await req.json();

  try {
    const updated = await prisma.detalleOrdenCompra.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al actualizar detalle:', error.message);
    } else {
      console.error('Error desconocido al actualizar detalle');
    }
    return NextResponse.json({ error: 'No se pudo actualizar' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);

  try {
    const deleted = await prisma.detalleOrdenCompra.delete({
      where: { id },
    });
    return NextResponse.json(deleted);
  } catch (error: unknown) {
    console.error('Error al eliminar detalle:', error);
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 });
  }
}
