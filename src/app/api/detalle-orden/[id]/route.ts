import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, context: any) {
  const id = Number(context.params.id);
  const data = await req.json();

  try {
    const updated = await prisma.detalleOrdenCompra.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo actualizar' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const id = Number(context.params.id);

  try {
    const deleted = await prisma.detalleOrdenCompra.delete({
      where: { id },
    });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 });
  }
}
