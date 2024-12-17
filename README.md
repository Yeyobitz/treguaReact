# 🍽️ TreguaReact

Sistema de gestión y reservas para restaurante Tregua, desarrollado con React + TypeScript.

## 🚀 Características Principales

- **Sistema de Reservas**: 
  - Reservas en tiempo real con validación de disponibilidad
  - Notificaciones por email y SMS
  - Gestión de estados (pendiente, confirmada, cancelada)
  - Auto-rellenado de datos para usuarios registrados
  - Cancelación de reservas con confirmación

- **Panel Administrativo**: 
  - Dashboard con métricas en tiempo real
  - Gestión completa de reservas
  - Administración de menú y platos
  - Control de usuarios y permisos
  - Exportación de menú a PDF

- **Perfil de Usuario**:
  - Historial de reservas
  - Gestión de datos personales
  - Cancelación de reservas
  - Vista de estado de reservas

- **Gestión de Menú**:
  - Categorización de platos
  - Imágenes con soporte multi-formato
  - Precios y descripciones
  - Exportación a PDF con diseño personalizado

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - React 18
  - TypeScript
  - TailwindCSS
  - React Router DOM v6
  - Lucide Icons
  - React Hook Form
  - Date-fns

- **Backend**:
  - Firebase Auth
  - Cloud Firestore
  - Firebase Storage
  - Cloud Functions

- **Herramientas**:
  - Vite
  - ESLint
  - Prettier
  - Vitest

## 📦 Instalación

1. Clona el repositorio:
\`\`\`bash
git clone https://github.com/Yeyobitz/treguaReact.git
\`\`\`

2. Navega al directorio:
\`\`\`bash
cd treguaReact
\`\`\`

3. Instala dependencias:
\`\`\`bash
npm install
\`\`\`

4. Configura variables de entorno:
\`\`\`bash
cp .env.example .env
\`\`\`

5. Inicia el servidor:
\`\`\`bash
npm run dev
\`\`\`

## 🔑 Variables de Entorno

\`\`\`env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_EMAIL_SERVICE_ID=tu_email_service_id
VITE_EMAIL_TEMPLATE_ID=tu_template_id
VITE_EMAIL_PUBLIC_KEY=tu_public_key
\`\`\`

## 📱 Funcionalidades Detalladas

### Sistema de Reservas
- Selección de fecha y hora con validación
- Límite de personas por reserva
- Notificaciones automáticas
- Validación de horarios disponibles
- Cancelación con confirmación

### Panel de Usuario
- Vista de reservas activas
- Historial de reservas pasadas
- Actualización de datos personales
- Gestión de reservas propias

### Panel Administrativo
- Vista de reservas del día
- Filtros por estado y fecha
- Exportación de menú y reservas a PDF
- Gestión de usuarios y roles
- Estadísticas de reservas

## 🔒 Roles y Permisos

- **Admin**: Acceso total al sistema
- **Manager**: Gestión de reservas y menú
- **Staff**: Vista de reservas
- **Usuario**: Gestión de reservas propias

## 🤝 Contribución

1. Fork del repositorio
2. Crea rama de feature (\`git checkout -b feature/NuevaCaracteristica\`)
3. Commit cambios (\`git commit -m 'Add: nueva característica'\`)
4. Push a la rama (\`git push origin feature/NuevaCaracteristica\`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👥 Equipo

- [@Yeyobitz](https://github.com/Yeyobitz) - Desarrollo Frontend y UI/UX
- [@Champye1](https://github.com/Champye1) - Backend y Base de Datos
- [@Rayoid](https://github.com/Rayoid) - Notificaciones y Testing

## 📧 Contacto

¿Preguntas o sugerencias? Contáctanos:
- Email: [yeyobitz@proton.me](mailto:yeyobitz@proton.me)

---

Hecho con ❤️ para Restaurante Tregua
