# 🌿 EcoTask

EcoTask es una aplicación web enfocada en la organización, gestión y seguimiento de tareas medioambientales y comunitarias. Está diseñada para que ciudadanos puedan inscribirse a actividades sostenibles y que administradores puedan coordinar, monitorear y generar reportes sobre dichas tareas.

---

## 📌 Características Principales

- Registro e inicio de sesión para usuarios y administradores.
- Listado y visualización de tareas medioambientales disponibles.
- Inscripción de voluntarios a tareas específicas.
- Reporte de progreso por parte de los usuarios.
- Panel administrativo para la creación, edición y eliminación de tareas.
- Generación de estadísticas e informes.
- Seguridad robusta con autenticación JWT, cifrado de contraseñas y control de roles.

---

## 🧱 Tecnologías Utilizadas

- **Frontend**: HTML, CSS, JavaScript (o React si aplica).
- **Backend**: Node.js / Express.js (especificar si usa otro framework).
- **Base de datos**: PostgreSQL / MySQL / MongoDB (según el proyecto).
- **Autenticación**: JWT (JSON Web Tokens)
- **ORM / ODM**: Sequelize / Mongoose (si aplica)
- **Otros**: Docker, ESLint, Prettier, etc.

---

## 🚀 Instalación y Ejecución Local

1. Clonar el repositorio:

```bash
git clone https://github.com/Santiago-Rivera/EcoTask.git
cd EcoTask
```

2. Instalar dependencias

```
npm install
```

3. Configurar las variables de entorno
 
 ```
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```
4. Inicar el servidor

```
npm run dev
```

---

## 🛡️ Seguridad
- EcoTask incluye prácticas de desarrollo seguro:

- Cifrado de contraseñas con bcrypt.

- Tokens JWT con expiración y rotación.

- Validación y sanitización de entradas.

- Control de acceso basado en roles.

- Pruebas contra ataques comunes: SQL Injection, XSS, CSRF.

## 🧪 Pruebas
- Pruebas unitarias y funcionales para los principales módulos.

- Casos de prueba para validaciones, flujos de usuario y seguridad.

- Scripts automatizados disponibles en la carpeta /tests.

## 🌐 Despliegue
- Puede ser desplegado en Heroku, Render, Vercel, o un servidor propio.

- Asegúrate de habilitar HTTPS y configurar correctamente las variables de entorno.

- Configura tu base de datos de producción con acceso restringido.

## 📄 Licencia
- Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más información.

## 🤝 Contribuciones
- ¡Las contribuciones son bienvenidas! Puedes abrir un issue o enviar un pull request.

- Fork del repositorio

- Crea una nueva rama (git checkout -b feature/nueva-funcionalidad)

- Haz tus cambios y realiza commits claros

- Envía un Pull Request

## 👨‍💻 Autor
- Santiago Rivera – @Santiago-Rivera
