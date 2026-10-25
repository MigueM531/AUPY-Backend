import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`[INFO] Seeding database...`);


  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aupy.com' },
    update: {},
    create: {
      name: 'Admin AUPY',
      email: 'admin@aupy.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`[INFO] Admin creado: ${admin.email}`);

  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@aupy.com' },
    update: {},
    create: {
      name: 'Usuario Demo',
      email: 'user@aupy.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log(`[INFO] User creado: ${user.email}`);

  const count = await prisma.challenge.count();
  if (count === 0) {
    const challenges = [
      {
        title: 'Hello World SQL Injection',
        description:
          'Un formulario de login vulnerable a SQLi básico. ¿Puedes obtener acceso sin credenciales?',
        writeup:
          "La consulta no está parametrizada. Usar `' OR 1=1 --` en el campo de usuario.",
        flag: 'AUPY{sql1_b4s1c_byp4ss}',
        points: 100,
        difficulty: 'EASY' as const,
        category: 'WEB' as const,
      },
      {
        title: 'Caesar Cipher',
        description:
          'Interceptamos un mensaje cifrado: "NHXD{f4rs4q_p1cu3q}". Descifra la flag.',
        writeup: 'Es un cifrado César con desplazamiento 13 (ROT13).',
        flag: 'AUPY{c4es4r_c1ph3r}',
        points: 50,
        difficulty: 'EASY' as const,
        category: 'CRYPTO' as const,
      },
      {
        title: 'Hidden in Plain Sight',
        description:
          'Esta imagen parece normal, pero esconde un secreto. Analízala con herramientas forenses.',
        writeup:
          'Usar `strings` o `exiftool` en la imagen para encontrar la flag en los metadatos.',
        flag: 'AUPY{m3t4d4t4_l34k}',
        points: 150,
        difficulty: 'MEDIUM' as const,
        category: 'FORENSICS' as const,
      },
      {
        title: 'Buffer Overflow 101',
        description:
          'Un binario vulnerable a buffer overflow. Sobrescribe la variable `admin` para ganar.',
        writeup:
          'El buffer tiene 64 bytes. Enviar 64 "A" + el valor esperado para sobrescribir la variable contigua.',
        flag: 'AUPY{st4ck_sm4sh1ng_101}',
        points: 300,
        difficulty: 'HARD' as const,
        category: 'PWNING' as const,
      },
      {
        title: 'The Impossible Reversing',
        description:
          'Un binario ofuscado que verifica una flag. Descompílalo y encuentra la clave.',
        writeup:
          'Usar Ghidra/IDA para descompilar. La flag se construye XOR-eando bytes en la función `check_flag()`.',
        flag: 'AUPY{r3v3rs3_3ng1n33r1ng_m4st3r}',
        points: 500,
        difficulty: 'HARD' as const,
        category: 'REVERSING' as const,
      },
    ];

    await prisma.challenge.createMany({ data: challenges });
    console.log(`[INFO] ${challenges.length} challenges creados.`);
  } else {
    console.log(`[INFO] Ya existen ${count} challenges, skip.`);
  }

  console.log(`[INFO] Seed completado.`);
}

main()
  .catch((e) => {
    console.error(`[ERROR] Error en seed:`, e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

