/**
 * Servicio de Internacionalización (i18n)
 * Maneja las traducciones de toda la aplicación
 */

export type Language = 'es' | 'en' | 'fr' | 'pt' | 'de';

export interface Translations {
  // Navegación y Layout
  nav: {
    dashboard: string;
    tasks: string;
    events: string;
    groups: string;
    settings: string;
    logout: string;
    ecoProject: string;
  };

  // Autenticación
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    loginButton: string;
    registerButton: string;
    loggingIn: string;
    registering: string;
    continueWith: string;
    continueWithGoogle: string;
    noAccount: string;
    hasAccount: string;
    registerHere: string;
    loginHere: string;
    showPassword: string;
    hidePassword: string;
    twoFactorTitle: string;
    twoFactorSubtitle: string;
    authCode: string;
    verifyCode: string;
    verifying: string;
    backToLogin: string;
    backupCodeHint: string;
    emailPlaceholder: string;
    enterTwoFactorCode: string;
    welcomeLoginSuccess: string;
    loginError: string;
    invalidCodeLength: string;
    twoFactorSuccess: string;
    backupCodeSuccess: string;
    incorrectCode: string;
    verificationError: string;
    googleLoginSuccess: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    welcomeMessage: string;
    quickActions: string;
    createTask: string;
    createEvent: string;
    createGroup: string;
    recentActivity: string;
    upcomingEvents: string;
    pendingTasks: string;
    activeGroups: string;
    noRecentActivity: string;
    noUpcomingEvents: string;
    noPendingTasks: string;
    noActiveGroups: string;
    completedTasks: string;
    positiveImpact: string;
    recentTasks: string;
  };

  // Tareas
  tasks: {
    tasks: string;
    createTask: string;
    editTask: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    category: string;
    status: string;
    assignedTo: string;
    save: string;
    cancel: string;
    delete: string;
    complete: string;
    pending: string;
    inProgress: string;
    completed: string;
    high: string;
    medium: string;
    low: string;
    work: string;
    personal: string;
    study: string;
    health: string;
    finance: string;
    other: string;
    noTasks: string;
    searchTasks: string;
    filterAll: string;
    filterPending: string;
    filterCompleted: string;
    sortByDate: string;
    sortByPriority: string;
    dueSoon: string;
    overdue: string;
  };

  // Eventos
  events: {
    events: string;
    createEvent: string;
    editEvent: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    category: string;
    save: string;
    cancel: string;
    delete: string;
    meeting: string;
    conference: string;
    workshop: string;
    social: string;
    other: string;
    noEvents: string;
    searchEvents: string;
    upcomingEvents: string;
    pastEvents: string;
    today: string;
    thisWeek: string;
    thisMonth: string;
    allTime: string;
  };

  // Grupos
  groups: {
    groups: string;
    createGroup: string;
    editGroup: string;
    name: string;
    description: string;
    color: string;
    members: string;
    save: string;
    cancel: string;
    delete: string;
    addMember: string;
    removeMember: string;
    leaveGroup: string;
    noGroups: string;
    searchGroups: string;
    myGroups: string;
    publicGroups: string;
    joinGroup: string;
    memberCount: string;
  };

  // Configuración
  settings: {
    settings: string;
    profile: string;
    notifications: string;
    appearance: string;
    security: string;
    language: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    save: string;
    saving: string;
    saved: string;
    cancel: string;
    changePhoto: string;
    uploading: string;
    emailNotifications: string;
    pushNotifications: string;
    taskReminders: string;
    eventReminders: string;
    groupInvitations: string;
    weeklyDigest: string;
    darkMode: string;
    lightMode: string;
    systemTheme: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updatePassword: string;
    updating: string;
    enable2FA: string;
    disable2FA: string;
    twoFactorAuth: string;
    configure2FA: string;
    generating: string;
    backupCodes: string;
    downloadCodes: string;
    copyCode: string;
    copied: string;
    regenerateCodes: string;
    userSettings: string;
    languageSettings: string;
    applicationLanguage: string;
    selectLanguage: string;
    languageChangeNote: string;
    tabs: {
      profile: string;
      notifications: string;
      security: string;
      appearance: string;
      language: string;
    };
  };

  // Notificaciones
  notifications: {
    taskCreated: string;
    taskUpdated: string;
    taskCompleted: string;
    eventCreated: string;
    eventUpdated: string;
    eventReminder: string;
    groupInvitation: string;
    groupUpdated: string;
    passwordChanged: string;
    twoFactorEnabled: string;
    twoFactorDisabled: string;
    loginSuccess: string;
    loginFailed: string;
    registrationSuccess: string;
    registrationFailed: string;
    emailSent: string;
    emailFailed: string;
    settingsSaved: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };

  // Formularios
  forms: {
    required: string;
    invalid: string;
    tooShort: string;
    tooLong: string;
    invalidEmail: string;
    passwordMismatch: string;
    selectOption: string;
    browse: string;
    uploading: string;
    uploadFailed: string;
    uploadSuccess: string;
  };

  // Fechas y tiempo
  time: {
    today: string;
    yesterday: string;
    tomorrow: string;
    thisWeek: string;
    nextWeek: string;
    thisMonth: string;
    nextMonth: string;
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    am: string;
    pm: string;
  };

  // Acciones comunes
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    update: string;
    close: string;
    open: string;
    loading: string;
    search: string;
    filter: string;
    sort: string;
    clear: string;
    reset: string;
    confirm: string;
    yes: string;
    no: string;
    ok: string;
    back: string;
    next: string;
    previous: string;
    continue: string;
    finish: string;
    start: string;
    stop: string;
    pause: string;
    resume: string;
    retry: string;
    refresh: string;
    unsavedChanges: string;
  };
}

// Traducciones en Español
const spanishTranslations: Translations = {
  nav: {
    dashboard: 'Panel',
    tasks: 'Tareas',
    events: 'Eventos',
    groups: 'Grupos',
    settings: 'Configuración',
    logout: 'Cerrar Sesión',
    ecoProject: 'Proyecto Ecológico'
  },
  auth: {
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    name: 'Nombre Completo',
    loginTitle: 'Iniciar Sesión',
    loginSubtitle: 'Accede a tu cuenta de EcoTask',
    registerTitle: 'Crear Cuenta',
    registerSubtitle: 'Únete a EcoTask y organiza tu vida',
    loginButton: 'Iniciar Sesión',
    registerButton: 'Crear Cuenta',
    loggingIn: 'Iniciando sesión...',
    registering: 'Creando cuenta...',
    continueWith: 'O continúa con',
    continueWithGoogle: 'Continuar con Google',
    noAccount: '¿No tienes una cuenta?',
    hasAccount: '¿Ya tienes una cuenta?',
    registerHere: 'Regístrate aquí',
    loginHere: 'Inicia sesión aquí',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    twoFactorTitle: 'Verificación 2FA',
    twoFactorSubtitle: 'Ingresa el código de tu aplicación autenticadora',
    authCode: 'Código de Autenticación (6 dígitos)',
    verifyCode: 'Verificar Código',
    verifying: 'Verificando...',
    backToLogin: '← Volver al inicio de sesión',
    backupCodeHint: 'También puedes usar un código de respaldo de 6 caracteres',
    emailPlaceholder: 'tu@ejemplo.com',
    enterTwoFactorCode: 'Por favor, ingresa tu código de autenticación de dos factores.',
    welcomeLoginSuccess: '¡Bienvenido! Has iniciado sesión correctamente.',
    loginError: 'Error al iniciar sesión. Inténtalo de nuevo.',
    invalidCodeLength: 'Por favor ingresa un código de 6 dígitos.',
    twoFactorSuccess: '¡Autenticación exitosa! Bienvenido.',
    backupCodeSuccess: '¡Autenticación exitosa con código de respaldo! Te quedan {{remaining}} códigos.',
    incorrectCode: 'Código incorrecto. Inténtalo de nuevo.',
    verificationError: 'Error al verificar el código. Inténtalo de nuevo.',
    googleLoginSuccess: '¡Bienvenido! Has iniciado sesión con Google.'
  },
  dashboard: {
    welcome: '¡Bienvenido!',
    welcomeMessage: 'Aquí tienes un resumen de tu actividad reciente',
    quickActions: 'Acciones Rápidas',
    createTask: 'Nueva Tarea',
    createEvent: 'Nuevo Evento',
    createGroup: 'Nuevo Grupo',
    recentActivity: 'Actividad Reciente',
    upcomingEvents: 'Próximos Eventos',
    pendingTasks: 'Tareas Pendientes',
    activeGroups: 'Grupos Activos',
    noRecentActivity: 'No hay actividad reciente',
    noUpcomingEvents: 'No hay eventos próximos',
    noPendingTasks: 'No hay tareas pendientes',
    noActiveGroups: 'No hay grupos activos',
    completedTasks: 'Tareas Completadas',
    positiveImpact: 'Impacto Positivo',
    recentTasks: 'Tareas Recientes'
  },
  tasks: {
    tasks: 'Tareas',
    createTask: 'Nueva Tarea',
    editTask: 'Editar Tarea',
    title: 'Título',
    description: 'Descripción',
    priority: 'Prioridad',
    dueDate: 'Fecha de Vencimiento',
    category: 'Categoría',
    status: 'Estado',
    assignedTo: 'Asignado a',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    complete: 'Completar',
    pending: 'Pendiente',
    inProgress: 'En Progreso',
    completed: 'Completada',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    work: 'Trabajo',
    personal: 'Personal',
    study: 'Estudio',
    health: 'Salud',
    finance: 'Finanzas',
    other: 'Otro',
    noTasks: 'No hay tareas',
    searchTasks: 'Buscar tareas...',
    filterAll: 'Todas',
    filterPending: 'Pendientes',
    filterCompleted: 'Completadas',
    sortByDate: 'Ordenar por fecha',
    sortByPriority: 'Ordenar por prioridad',
    dueSoon: 'Vence pronto',
    overdue: 'Vencida'
  },
  events: {
    events: 'Eventos',
    createEvent: 'Nuevo Evento',
    editEvent: 'Editar Evento',
    title: 'Título',
    description: 'Descripción',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    location: 'Ubicación',
    category: 'Categoría',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    meeting: 'Reunión',
    conference: 'Conferencia',
    workshop: 'Taller',
    social: 'Social',
    other: 'Otro',
    noEvents: 'No hay eventos',
    searchEvents: 'Buscar eventos...',
    upcomingEvents: 'Próximos Eventos',
    pastEvents: 'Eventos Pasados',
    today: 'Hoy',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mes',
    allTime: 'Todo el Tiempo'
  },
  groups: {
    groups: 'Grupos',
    createGroup: 'Nuevo Grupo',
    editGroup: 'Editar Grupo',
    name: 'Nombre',
    description: 'Descripción',
    color: 'Color',
    members: 'Miembros',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    addMember: 'Agregar Miembro',
    removeMember: 'Eliminar Miembro',
    leaveGroup: 'Salir del Grupo',
    noGroups: 'No hay grupos',
    searchGroups: 'Buscar grupos...',
    myGroups: 'Mis Grupos',
    publicGroups: 'Grupos Públicos',
    joinGroup: 'Unirse al Grupo',
    memberCount: 'miembros'
  },
  settings: {
    settings: 'Configuración',
    profile: 'Perfil',
    notifications: 'Notificaciones',
    appearance: 'Apariencia',
    security: 'Seguridad',
    language: 'Idioma',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo Electrónico',
    avatar: 'Foto de Perfil',
    save: 'Guardar',
    saving: 'Guardando...',
    saved: '¡Guardado!',
    cancel: 'Cancelar',
    changePhoto: 'Cambiar Foto',
    uploading: 'Subiendo...',
    emailNotifications: 'Notificaciones por Email',
    pushNotifications: 'Notificaciones Push',
    taskReminders: 'Recordatorios de Tareas',
    eventReminders: 'Recordatorios de Eventos',
    groupInvitations: 'Invitaciones de Grupos',
    weeklyDigest: 'Resumen Semanal',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    systemTheme: 'Seguir Sistema',
    changePassword: 'Cambiar Contraseña',
    currentPassword: 'Contraseña Actual',
    newPassword: 'Nueva Contraseña',
    confirmNewPassword: 'Confirmar Nueva Contraseña',
    updatePassword: 'Actualizar Contraseña',
    updating: 'Actualizando...',
    enable2FA: 'Habilitar 2FA',
    disable2FA: 'Deshabilitar 2FA',
    twoFactorAuth: 'Autenticación de Dos Factores',
    configure2FA: 'Configurar Autenticación de Dos Factores',
    generating: 'Generando...',
    backupCodes: 'Códigos de Respaldo',
    downloadCodes: 'Descargar Códigos',
    copyCode: 'Copiar',
    copied: '¡Copiado!',
    regenerateCodes: 'Regenerar Códigos',
    userSettings: 'Configuración de Usuario',
    languageSettings: 'Configuración de Idioma',
    applicationLanguage: 'Idioma de la aplicación',
    selectLanguage: 'Seleccionar idioma de la aplicación',
    languageChangeNote: 'Los cambios se aplicarán inmediatamente',
    tabs: {
      profile: 'Perfil',
      notifications: 'Notificaciones',
      security: 'Seguridad',
      appearance: 'Apariencia',
      language: 'Idioma'
    }
  },
  notifications: {
    taskCreated: 'Tarea creada',
    taskUpdated: 'Tarea actualizada',
    taskCompleted: 'Tarea completada',
    eventCreated: 'Evento creado',
    eventUpdated: 'Evento actualizado',
    eventReminder: 'Recordatorio de evento',
    groupInvitation: 'Invitación a grupo',
    groupUpdated: 'Grupo actualizado',
    passwordChanged: 'Contraseña cambiada',
    twoFactorEnabled: '2FA habilitado',
    twoFactorDisabled: '2FA deshabilitado',
    loginSuccess: 'Inicio de sesión exitoso',
    loginFailed: 'Error al iniciar sesión',
    registrationSuccess: 'Registro exitoso',
    registrationFailed: 'Error en el registro',
    emailSent: 'Email enviado',
    emailFailed: 'Error al enviar email',
    settingsSaved: 'Configuración guardada',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información'
  },
  forms: {
    required: 'Este campo es obligatorio',
    invalid: 'Valor inválido',
    tooShort: 'Muy corto',
    tooLong: 'Muy largo',
    invalidEmail: 'Email inválido',
    passwordMismatch: 'Las contraseñas no coinciden',
    selectOption: 'Selecciona una opción',
    browse: 'Examinar...',
    uploading: 'Subiendo...',
    uploadFailed: 'Error al subir',
    uploadSuccess: 'Subido correctamente'
  },
  time: {
    today: 'Hoy',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    thisWeek: 'Esta semana',
    nextWeek: 'Próxima semana',
    thisMonth: 'Este mes',
    nextMonth: 'Próximo mes',
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
    july: 'Julio',
    august: 'Agosto',
    september: 'Septiembre',
    october: 'Octubre',
    november: 'Noviembre',
    december: 'Diciembre',
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
    am: 'AM',
    pm: 'PM'
  },
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    update: 'Actualizar',
    close: 'Cerrar',
    open: 'Abrir',
    loading: 'Cargando...',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    clear: 'Limpiar',
    reset: 'Restablecer',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    ok: 'OK',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    continue: 'Continuar',
    finish: 'Finalizar',
    start: 'Iniciar',
    stop: 'Detener',
    pause: 'Pausar',
    resume: 'Reanudar',
    retry: 'Reintentar',
    refresh: 'Actualizar',
    unsavedChanges: 'Cambios sin guardar'
  }
};

// Traducciones en Inglés
const englishTranslations: Translations = {
  nav: {
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    events: 'Events',
    groups: 'Groups',
    settings: 'Settings',
    logout: 'Logout',
    ecoProject: 'Eco Project'
  },
  auth: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    loginTitle: 'Sign In',
    loginSubtitle: 'Access your EcoTask account',
    registerTitle: 'Create Account',
    registerSubtitle: 'Join EcoTask and organize your life',
    loginButton: 'Sign In',
    registerButton: 'Create Account',
    loggingIn: 'Signing in...',
    registering: 'Creating account...',
    continueWith: 'Or continue with',
    continueWithGoogle: 'Continue with Google',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    registerHere: 'Register here',
    loginHere: 'Sign in here',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    twoFactorTitle: '2FA Verification',
    twoFactorSubtitle: 'Enter the code from your authenticator app',
    authCode: 'Authentication Code (6 digits)',
    verifyCode: 'Verify Code',
    verifying: 'Verifying...',
    backToLogin: '← Back to login',
    backupCodeHint: 'You can also use a 6-character backup code',
    emailPlaceholder: 'your@example.com',
    enterTwoFactorCode: 'Please enter your two-factor authentication code.',
    welcomeLoginSuccess: 'Welcome! You have successfully logged in.',
    loginError: 'Login error. Please try again.',
    invalidCodeLength: 'Please enter a 6-digit code.',
    twoFactorSuccess: 'Authentication successful! Welcome.',
    backupCodeSuccess: 'Authentication successful with backup code! You have {{remaining}} codes remaining.',
    incorrectCode: 'Incorrect code. Please try again.',
    verificationError: 'Error verifying code. Please try again.',
    googleLoginSuccess: 'Welcome! You have signed in with Google.'
  },
  dashboard: {
    welcome: 'Welcome!',
    welcomeMessage: 'Here is a summary of your recent activity',
    quickActions: 'Quick Actions',
    createTask: 'New Task',
    createEvent: 'New Event',
    createGroup: 'New Group',
    recentActivity: 'Recent Activity',
    upcomingEvents: 'Upcoming Events',
    pendingTasks: 'Pending Tasks',
    activeGroups: 'Active Groups',
    noRecentActivity: 'No recent activity',
    noUpcomingEvents: 'No upcoming events',
    noPendingTasks: 'No pending tasks',
    noActiveGroups: 'No active groups',
    completedTasks: 'Completed Tasks',
    positiveImpact: 'Positive Impact',
    recentTasks: 'Recent Tasks'
  },
  tasks: {
    tasks: 'Tasks',
    createTask: 'New Task',
    editTask: 'Edit Task',
    title: 'Title',
    description: 'Description',
    priority: 'Priority',
    dueDate: 'Due Date',
    category: 'Category',
    status: 'Status',
    assignedTo: 'Assigned to',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    complete: 'Complete',
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    work: 'Work',
    personal: 'Personal',
    study: 'Study',
    health: 'Health',
    finance: 'Finance',
    other: 'Other',
    noTasks: 'No tasks',
    searchTasks: 'Search tasks...',
    filterAll: 'All',
    filterPending: 'Pending',
    filterCompleted: 'Completed',
    sortByDate: 'Sort by date',
    sortByPriority: 'Sort by priority',
    dueSoon: 'Due soon',
    overdue: 'Overdue'
  },
  events: {
    events: 'Events',
    createEvent: 'New Event',
    editEvent: 'Edit Event',
    title: 'Title',
    description: 'Description',
    startDate: 'Start Date',
    endDate: 'End Date',
    location: 'Location',
    category: 'Category',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    meeting: 'Meeting',
    conference: 'Conference',
    workshop: 'Workshop',
    social: 'Social',
    other: 'Other',
    noEvents: 'No events',
    searchEvents: 'Search events...',
    upcomingEvents: 'Upcoming Events',
    pastEvents: 'Past Events',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    allTime: 'All Time'
  },
  groups: {
    groups: 'Groups',
    createGroup: 'New Group',
    editGroup: 'Edit Group',
    name: 'Name',
    description: 'Description',
    color: 'Color',
    members: 'Members',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    addMember: 'Add Member',
    removeMember: 'Remove Member',
    leaveGroup: 'Leave Group',
    noGroups: 'No groups',
    searchGroups: 'Search groups...',
    myGroups: 'My Groups',
    publicGroups: 'Public Groups',
    joinGroup: 'Join Group',
    memberCount: 'members'
  },
  settings: {
    settings: 'Settings',
    profile: 'Profile',
    notifications: 'Notifications',
    appearance: 'Appearance',
    security: 'Security',
    language: 'Language',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    avatar: 'Profile Picture',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved!',
    cancel: 'Cancel',
    changePhoto: 'Change Photo',
    uploading: 'Uploading...',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    taskReminders: 'Task Reminders',
    eventReminders: 'Event Reminders',
    groupInvitations: 'Group Invitations',
    weeklyDigest: 'Weekly Digest',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemTheme: 'Follow System',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    updating: 'Updating...',
    enable2FA: 'Enable 2FA',
    disable2FA: 'Disable 2FA',
    twoFactorAuth: 'Two-Factor Authentication',
    configure2FA: 'Configure Two-Factor Authentication',
    generating: 'Generating...',
    backupCodes: 'Backup Codes',
    downloadCodes: 'Download Codes',
    copyCode: 'Copy',
    copied: 'Copied!',
    regenerateCodes: 'Regenerate Codes',
    userSettings: 'User Settings',
    languageSettings: 'Language Settings',
    applicationLanguage: 'Application Language',
    selectLanguage: 'Select application language',
    languageChangeNote: 'Changes will be applied immediately',
    tabs: {
      profile: 'Profile',
      notifications: 'Notifications',
      security: 'Security',
      appearance: 'Appearance',
      language: 'Language'
    }
  },
  notifications: {
    taskCreated: 'Task created',
    taskUpdated: 'Task updated',
    taskCompleted: 'Task completed',
    eventCreated: 'Event created',
    eventUpdated: 'Event updated',
    eventReminder: 'Event reminder',
    groupInvitation: 'Group invitation',
    groupUpdated: 'Group updated',
    passwordChanged: 'Password changed',
    twoFactorEnabled: '2FA enabled',
    twoFactorDisabled: '2FA disabled',
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    registrationSuccess: 'Registration successful',
    registrationFailed: 'Registration failed',
    emailSent: 'Email sent',
    emailFailed: 'Email failed',
    settingsSaved: 'Settings saved',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information'
  },
  forms: {
    required: 'This field is required',
    invalid: 'Invalid value',
    tooShort: 'Too short',
    tooLong: 'Too long',
    invalidEmail: 'Invalid email',
    passwordMismatch: 'Passwords do not match',
    selectOption: 'Select an option',
    browse: 'Browse...',
    uploading: 'Uploading...',
    uploadFailed: 'Upload failed',
    uploadSuccess: 'Upload successful'
  },
  time: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    nextWeek: 'Next week',
    thisMonth: 'This month',
    nextMonth: 'Next month',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    am: 'AM',
    pm: 'PM'
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    close: 'Close',
    open: 'Open',
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    clear: 'Clear',
    reset: 'Reset',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    continue: 'Continue',
    finish: 'Finish',
    start: 'Start',
    stop: 'Stop',
    pause: 'Pause',
    resume: 'Resume',
    retry: 'Retry',
    refresh: 'Refresh',
    unsavedChanges: 'Unsaved Changes'
  }
};

// Traducciones básicas para otros idiomas (se pueden expandir)
const frenchTranslations: Translations = {
  ...englishTranslations,
  nav: {
    dashboard: 'Tableau de bord',
    tasks: 'Tâches',
    events: 'Événements',
    groups: 'Groupes',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    ecoProject: 'Projet Écologique'
  },
  auth: {
    login: 'Connexion',
    register: "S'inscrire",
    email: 'E-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    name: 'Nom complet',
    loginTitle: 'Se connecter',
    loginSubtitle: 'Accédez à votre compte EcoTask',
    registerTitle: 'Créer un compte',
    registerSubtitle: 'Rejoignez EcoTask et organisez votre vie',
    loginButton: 'Se connecter',
    registerButton: 'Créer un compte',
    loggingIn: 'Connexion en cours...',
    registering: 'Création du compte...',
    continueWith: 'Ou continuer avec',
    continueWithGoogle: 'Continuer avec Google',
    noAccount: "Vous n'avez pas de compte ?",
    hasAccount: 'Vous avez déjà un compte ?',
    registerHere: 'Inscrivez-vous ici',
    loginHere: 'Connectez-vous ici',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    twoFactorTitle: 'Vérification 2FA',
    twoFactorSubtitle: 'Entrez le code de votre application d\'authentification',
    authCode: 'Code d\'authentification (6 chiffres)',
    verifyCode: 'Vérifier le code',
    verifying: 'Vérification...',
    backToLogin: '← Retour à la connexion',
    backupCodeHint: 'Vous pouvez aussi utiliser un code de sauvegarde à 6 caractères',
    emailPlaceholder: 'votre@exemple.com',
    enterTwoFactorCode: 'Veuillez entrer votre code d\'authentification à deux facteurs.',
    welcomeLoginSuccess: 'Bienvenue ! Vous vous êtes connecté avec succès.',
    loginError: 'Erreur de connexion. Veuillez réessayer.',
    invalidCodeLength: 'Veuillez entrer un code à 6 chiffres.',
    twoFactorSuccess: 'Authentification réussie ! Bienvenue.',
    backupCodeSuccess: 'Authentification réussie avec le code de sauvegarde ! Il vous reste {{remaining}} codes.',
    incorrectCode: 'Code incorrect. Veuillez réessayer.',
    verificationError: 'Erreur lors de la vérification du code. Veuillez réessayer.',
    googleLoginSuccess: 'Bienvenue ! Vous vous êtes connecté avec Google.'
  },
  settings: {
    ...englishTranslations.settings,
    userSettings: 'Paramètres utilisateur',
    languageSettings: 'Paramètres de langue',
    applicationLanguage: 'Langue de l\'application',
    selectLanguage: 'Sélectionner la langue de l\'application',
    languageChangeNote: 'Les modifications seront appliquées immédiatement',
    tabs: {
      profile: 'Profil',
      notifications: 'Notifications',
      security: 'Sécurité',
      appearance: 'Apparence',
      language: 'Langue'
    },
    profile: 'Profil',
    notifications: 'Notifications',
    appearance: 'Apparence',
    security: 'Sécurité',
    language: 'Langue',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    email: 'E-mail',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    changePassword: 'Changer le mot de passe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmNewPassword: 'Confirmer le nouveau mot de passe',
    updatePassword: 'Mettre à jour le mot de passe',
    twoFactorAuth: 'Authentification à deux facteurs',
    enable2FA: 'Activer 2FA',
    disable2FA: 'Désactiver 2FA',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair'
  },
  common: {
    ...englishTranslations.common,
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    update: 'Mettre à jour',
    close: 'Fermer',
    loading: 'Chargement...',
    search: 'Rechercher',
    unsavedChanges: 'Modifications non enregistrées'
  }
};

const portugueseTranslations: Translations = {
  ...englishTranslations,
  nav: {
    dashboard: 'Painel',
    tasks: 'Tarefas',
    events: 'Eventos',
    groups: 'Grupos',
    settings: 'Configurações',
    logout: 'Sair',
    ecoProject: 'Projeto Ecológico'
  },
  auth: {
    login: 'Entrar',
    register: 'Registrar',
    email: 'E-mail',
    password: 'Senha',
    confirmPassword: 'Confirmar senha',
    name: 'Nome completo',
    loginTitle: 'Fazer Login',
    loginSubtitle: 'Acesse sua conta EcoTask',
    registerTitle: 'Criar Conta',
    registerSubtitle: 'Junte-se ao EcoTask e organize sua vida',
    loginButton: 'Entrar',
    registerButton: 'Criar Conta',
    loggingIn: 'Entrando...',
    registering: 'Criando conta...',
    continueWith: 'Ou continue com',
    continueWithGoogle: 'Continuar com Google',
    noAccount: 'Não tem uma conta?',
    hasAccount: 'Já tem uma conta?',
    registerHere: 'Registre-se aqui',
    loginHere: 'Faça login aqui',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    twoFactorTitle: 'Verificação 2FA',
    twoFactorSubtitle: 'Digite o código do seu aplicativo autenticador',
    authCode: 'Código de Autenticação (6 dígitos)',
    verifyCode: 'Verificar Código',
    verifying: 'Verificando...',
    backToLogin: '← Voltar ao login',
    backupCodeHint: 'Você também pode usar um código de backup de 6 caracteres',
    emailPlaceholder: 'seu@exemplo.com',
    enterTwoFactorCode: 'Por favor, digite seu código de autenticação de dois fatores.',
    welcomeLoginSuccess: 'Bem-vindo! Você fez login com sucesso.',
    loginError: 'Erro no login. Tente novamente.',
    invalidCodeLength: 'Por favor, digite um código de 6 dígitos.',
    twoFactorSuccess: 'Autenticação bem-sucedida! Bem-vindo.',
    backupCodeSuccess: 'Autenticação bem-sucedida com código de backup! Você tem {{remaining}} códigos restantes.',
    incorrectCode: 'Código incorreto. Tente novamente.',
    verificationError: 'Erro ao verificar o código. Tente novamente.',
    googleLoginSuccess: 'Bem-vindo! Você fez login com Google.'
  },
  settings: {
    ...englishTranslations.settings,
    userSettings: 'Configurações do Usuário',
    languageSettings: 'Configurações de Idioma',
    applicationLanguage: 'Idioma da aplicação',
    selectLanguage: 'Selecionar idioma da aplicação',
    languageChangeNote: 'As alterações serão aplicadas imediatamente',
    tabs: {
      profile: 'Perfil',
      notifications: 'Notificações',
      security: 'Segurança',
      appearance: 'Aparência',
      language: 'Idioma'
    },
    profile: 'Perfil',
    notifications: 'Notificações',
    appearance: 'Aparência',
    security: 'Segurança',
    language: 'Idioma',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    email: 'E-mail',
    save: 'Salvar',
    saving: 'Salvando...',
    cancel: 'Cancelar'
  },
  common: {
    ...englishTranslations.common,
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    create: 'Criar',
    update: 'Atualizar',
    close: 'Fechar',
    loading: 'Carregando...',
    search: 'Pesquisar',
    unsavedChanges: 'Alterações não salvas'
  }
};

const germanTranslations: Translations = {
  ...englishTranslations,
  nav: {
    dashboard: 'Dashboard',
    tasks: 'Aufgaben',
    events: 'Ereignisse',
    groups: 'Gruppen',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    ecoProject: 'Öko-Projekt'
  },
  auth: {
    login: 'Anmelden',
    register: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    name: 'Vollständiger Name',
    loginTitle: 'Anmelden',
    loginSubtitle: 'Zugang zu Ihrem EcoTask-Konto',
    registerTitle: 'Konto erstellen',
    registerSubtitle: 'Treten Sie EcoTask bei und organisieren Sie Ihr Leben',
    loginButton: 'Anmelden',
    registerButton: 'Konto erstellen',
    loggingIn: 'Anmeldung läuft...',
    registering: 'Konto wird erstellt...',
    continueWith: 'Oder fortfahren mit',
    continueWithGoogle: 'Mit Google fortfahren',
    noAccount: 'Haben Sie kein Konto?',
    hasAccount: 'Haben Sie bereits ein Konto?',
    registerHere: 'Hier registrieren',
    loginHere: 'Hier anmelden',
    showPassword: 'Passwort anzeigen',
    hidePassword: 'Passwort verbergen',
    twoFactorTitle: '2FA-Verifizierung',
    twoFactorSubtitle: 'Geben Sie den Code aus Ihrer Authenticator-App ein',
    authCode: 'Authentifizierungscode (6 Ziffern)',
    verifyCode: 'Code verifizieren',
    verifying: 'Wird verifiziert...',
    backToLogin: '← Zurück zur Anmeldung',
    backupCodeHint: 'Sie können auch einen 6-stelligen Backup-Code verwenden',
    emailPlaceholder: 'ihre@beispiel.com',
    enterTwoFactorCode: 'Bitte geben Sie Ihren Zwei-Faktor-Authentifizierungscode ein.',
    welcomeLoginSuccess: 'Willkommen! Sie haben sich erfolgreich angemeldet.',
    loginError: 'Anmeldefehler. Bitte versuchen Sie es erneut.',
    invalidCodeLength: 'Bitte geben Sie einen 6-stelligen Code ein.',
    twoFactorSuccess: 'Authentifizierung erfolgreich! Willkommen.',
    backupCodeSuccess: 'Authentifizierung mit Backup-Code erfolgreich! Sie haben {{remaining}} Codes übrig.',
    incorrectCode: 'Falscher Code. Bitte versuchen Sie es erneut.',
    verificationError: 'Fehler beim Verifizieren des Codes. Bitte versuchen Sie es erneut.',
    googleLoginSuccess: 'Willkommen! Sie haben sich mit Google angemeldet.'
  },
  settings: {
    ...englishTranslations.settings,
    userSettings: 'Benutzereinstellungen',
    languageSettings: 'Spracheinstellungen',
    applicationLanguage: 'Anwendungssprache',
    selectLanguage: 'Anwendungssprache auswählen',
    languageChangeNote: 'Änderungen werden sofort angewendet',
    tabs: {
      profile: 'Profil',
      notifications: 'Benachrichtigungen',
      security: 'Sicherheit',
      appearance: 'Erscheinungsbild',
      language: 'Sprache'
    },
    profile: 'Profil',
    notifications: 'Benachrichtigungen',
    appearance: 'Erscheinungsbild',
    security: 'Sicherheit',
    language: 'Sprache',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    save: 'Speichern',
    saving: 'Wird gespeichert...',
    cancel: 'Abbrechen'
  },
  common: {
    ...englishTranslations.common,
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    create: 'Erstellen',
    update: 'Aktualisieren',
    close: 'Schließen',
    loading: 'Wird geladen...',
    search: 'Suchen',
    unsavedChanges: 'Nicht gespeicherte Änderungen'
  }
};

// Mapeo de traducciones por idioma
const translations: Record<Language, Translations> = {
  es: spanishTranslations,
  en: englishTranslations,
  fr: frenchTranslations,
  pt: portugueseTranslations,
  de: germanTranslations
};

// Información de idiomas disponibles
export const availableLanguages = [
  { code: 'es' as Language, name: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt' as Language, name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'de' as Language, name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
];

/**
 * Clase principal del servicio de internacionalización
 */
class I18nService {
  private currentLanguage: Language = 'es';
  private subscribers: Array<(language: Language) => void> = [];

  constructor() {
    // Cargar idioma guardado
    this.loadSavedLanguage();
  }

  /**
   * Cargar idioma guardado del localStorage
   */
  private loadSavedLanguage(): void {
    try {
      const saved = localStorage.getItem('app_language');
      if (saved && this.isValidLanguage(saved)) {
        this.currentLanguage = saved as Language;
      }
    } catch (error) {
      console.warn('Error loading saved language:', error);
    }
  }

  /**
   * Verificar si un código de idioma es válido
   */
  private isValidLanguage(lang: string): boolean {
    return ['es', 'en', 'fr', 'pt', 'de'].includes(lang);
  }

  /**
   * Obtener el idioma actual
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Cambiar idioma
   */
  setLanguage(language: Language): void {
    if (this.currentLanguage !== language) {
      this.currentLanguage = language;
      this.saveLanguage(language);
      this.notifySubscribers(language);
    }
  }

  /**
   * Guardar idioma en localStorage
   */
  private saveLanguage(language: Language): void {
    try {
      localStorage.setItem('app_language', language);
    } catch (error) {
      console.warn('Error saving language:', error);
    }
  }

  /**
   * Obtener traducciones para el idioma actual
   */
  getTranslations(): Translations {
    return translations[this.currentLanguage] || translations.es;
  }

  /**
   * Obtener una traducción específica por clave
   */
  t(key: string): string {
    const trans = this.getTranslations();
    const keys = key.split('.');
    let result: unknown = trans;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof result === 'string' ? result : key;
  }

  /**
   * Suscribirse a cambios de idioma
   */
  subscribe(callback: (language: Language) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /**
   * Notificar a los suscriptores sobre cambio de idioma
   */
  private notifySubscribers(language: Language): void {
    this.subscribers.forEach(callback => {
      try {
        callback(language);
      } catch (error) {
        console.error('Error in language change subscriber:', error);
      }
    });
  }

  /**
   * Obtener información de todos los idiomas disponibles
   */
  getAvailableLanguages() {
    return availableLanguages;
  }

  /**
   * Formatear fecha según el idioma actual
   */
  formatDate(date: Date): string {
    const locale = this.getLocaleCode();
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatear fecha y hora según el idioma actual
   */
  formatDateTime(date: Date): string {
    const locale = this.getLocaleCode();
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtener código de locale para formateo
   */
  private getLocaleCode(): string {
    const locales: Record<Language, string> = {
      es: 'es-ES',
      en: 'en-US',
      fr: 'fr-FR',
      pt: 'pt-BR',
      de: 'de-DE'
    };
    return locales[this.currentLanguage] || 'es-ES';
  }
}

// Exportar instancia singleton
export const i18nService = new I18nService();
export default i18nService;
