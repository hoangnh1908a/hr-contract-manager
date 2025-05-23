export type Language = 'en' | 'vi';

export interface Translations {
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    loginButton: string;
    loggingIn: string;
    rememberMe: string;
    forgotPassword: string;
    newUser: string;
    createAccount: string;
    invalidCredentials: string;
    networkError: string;
    authFailed: string;
  };
  register: {
    title: string;
    subtitle: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: string;
    privacy: string;
    agreeTerms: string;
    registerButton: string;
    alreadyHaveAccount: string;
    signIn: string;
  };
  dashboard: {
    welcome: string;
    totalUsers: string;
    totalProfit: string;
    newProject: string;
    salesOverview: string;
    revenueReport: string;
    weeklyOverview: string;
    viewAll: string;
    viewDetails: string;
    viewReport: string;
  };
  navigation: {
    dashboard: string;
    accountSettings: string;
    profile: string;
    security: string;
    billing: string;
    notifications: string;
    formLayouts: string;
    cards: string;
    search: string;
    logout: string;
    roles: string;
    admin: string;
    auditLogs: string;
    position: string;
    users: string;
    departments: string;
    employees: string;
    contracts: string;
    hr: string;
    contractTemplates: string;
    contractStatuses: string;
    contractApprovals: string;
    management: string;
    configs: string;
  };
  accountSettings: {
    title: string;
    general: string;
    personalInfo: string;
    email: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updateProfile: string;
    deleteAccount: string;
    deleteWarning: string;
  };
  roles: {
    title: string;
    name: string;
    addRole: string;
    editRole: string;
    deleteRole: string;
    roleNamePlaceholder: string;
    searchRoles: string;
    roleCreated: string;
    roleUpdated: string;
    roleDeleted: string;
    confirmDelete: string;
  };
  city: {
    title: string;
    name: string;
    addCity: string;
    editCity: string;
    deleteCity: string;
    cityNamePlaceholder: string;
    searchCities: string;
    cityCreated: string;
    cityUpdated: string;
    cityDeleted: string;
    confirmDelete: string;
  };
  district: {
    title: string;
    name: string;
    city: string;
    addDistrict: string;
    editDistrict: string;
    deleteDistrict: string;
    districtNamePlaceholder: string;
    searchDistricts: string;
    districtCreated: string;
    districtUpdated: string;
    districtDeleted: string;
    confirmDelete: string;
    selectCity: string;
  };
  auditLogs: {
    title: string;
    id: string;
    fullName: string;
    tableName: string;
    recordId: string;
    oldValue: string;
    newValue: string;
    timestamp: string;
    searchLogs: string;
    noLogsFound: string;
    details: string;
    viewDetails: string;
  };
  position: {
    title: string;
    name: string;
    addPosition: string;
    editPosition: string;
    deletePosition: string;
    positionNamePlaceholder: string;
    searchPositions: string;
    positionCreated: string;
    positionUpdated: string;
    positionDeleted: string;
    confirmDelete: string;
  };
  users: {
    title: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    addUser: string;
    editUser: string;
    lockUser: string;
    userNamePlaceholder: string;
    searchUsers: string;
    userCreated: string;
    userUpdated: string;
    userLocked: string;
    confirmLock: string;
    passwordMismatch: string;
    passwordRequired: string;
    leaveBlankPassword: string;
    errorLockMyUser: string;
    userResetPassword: string;
    resetPassword: string;
  };
  common: {
    languageSwitch: string;
    save: string;
    cancel: string;
    remove: string;
    search: string;
    filter: string;
    loading: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    active: string;
    inactive: string;
    noData: string;
    actions: string;
    rowsPerPage: string;
    of: string;
    lock: string;
    status: string;
    operationFailed: string;
    deleteFailed: string;
    refreshSuccess: string;
    refreshError: string;
    refresh: string;
  };
  departments: {
    title: string;
    name: string;
    addDepartment: string;
    editDepartment: string;
    deleteDepartment: string;
    departmentNamePlaceholder: string;
    searchDepartments: string;
    departmentCreated: string;
    departmentUpdated: string;
    departmentDeleted: string;
    confirmDelete: string;
  };
  employees: {
    title: string;
    fullName: string;
    numberId: string;
    dateOfBirth: string;
    sex: string;
    male: string;
    female: string;
    other: string;
    nationality: string;
    placeOfOrigin: string;
    placeOfResidence: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    hireDate: string;
    addEmployee: string;
    editEmployee: string;
    deleteEmployee: string;
    employeeNamePlaceholder: string;
    searchEmployees: string;
    employeeCreated: string;
    employeeUpdated: string;
    employeeDeleted: string;
    confirmDelete: string;
    personalInfo: string;
    contactInfo: string;
    employmentInfo: string;
    selectDepartment: string;
    selectPosition: string;
    salary: string;
    salaryAllowance: string;
  };
  contracts: {
    title: string;
    employee: string;
    employer: string;
    template: string;
    fileName: string;
    fileNameEn: string;
    description: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    addContract: string;
    editContract: string;
    deleteContract: string;
    contractNamePlaceholder: string;
    searchContracts: string;
    contractCreated: string;
    contractUpdated: string;
    contractDeleted: string;
    confirmDelete: string;
    contractInfo: string;
    selectEmployee: string;
    selectEmployer: string;
    selectTemplate: string;
    selectStatus: string;
    fileDetails: string;
    trackingInfo: string;
    fromDate: string;
    toDate: string;
    downloadContract: string;
    downloadStarted: string;
    missingRequiredFields: string;
    type: string;
    enterContractType: string;
  };
  contractTemplates: {
    title: string;
    fileName: string;
    fileNameEn: string;
    description: string;
    addContractTemplate: string;
    editContractTemplate: string;
    deleteContractTemplate: string;
    contractTemplateNamePlaceholder: string;
    contractTemplateParamsPlaceholder: string;
    searchContractTemplates: string;
    contractTemplateCreated: string;
    contractTemplateUpdated: string;
    contractTemplateDeleted: string;
    confirmDelete: string;
    chosseFile: string;
    params: string;
    paramsPlaceholder: string;
    paramsHelper: string;
  };
  contractStatuses: {
    title: string;
    name: string;
    nameEn: string;
    language: string;
    description: string;
    addContractStatus: string;
    editContractStatus: string;
    deleteContractStatus: string;
    contractStatusNamePlaceholder: string;
    searchContractStatuses: string;
    contractStatusCreated: string;
    contractStatusUpdated: string;
    contractStatusDeleted: string;
    confirmDelete: string;
    noContractStatusFound: string;
    languagePlaceholder: string;
  };
  configs: {
    title: string;
    type: string;
    code: string;
    name: string;
    nameEn: string;
    description: string;
    addConfig: string;
    editConfig: string;
    deleteConfig: string;
    configNamePlaceholder: string;
    searchConfigs: string;
    configCreated: string;
    configUpdated: string;
    configDeleted: string;
    confirmDelete: string;
    noConfigFound: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    login: {
      title: 'Welcome to Company! 👋',
      subtitle: 'Please sign in to your account and start the adventure',
      email: 'Email',
      password: 'Password',
      loginButton: 'Sign In',
      loggingIn: 'Signing in...',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      newUser: 'New on our platform?',
      createAccount: 'Create an account',
      invalidCredentials: 'Invalid email or password',
      networkError: 'Network error. Please check your connection',
      authFailed: 'Authentication failed'
    },
    register: {
      title: 'Adventure starts here 🚀',
      subtitle: 'Make your app management easy and fun!',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      agreeTerms: 'I agree to the',
      registerButton: 'Sign up',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign in instead'
    },
    dashboard: {
      welcome: 'Welcome',
      totalUsers: 'Total Users',
      totalProfit: 'Total Profit',
      newProject: 'New Project',
      salesOverview: 'Sales Overview',
      revenueReport: 'Revenue Report',
      weeklyOverview: 'Weekly Overview',
      viewAll: 'View All',
      viewDetails: 'View Details',
      viewReport: 'View Report'
    },
    navigation: {
      dashboard: 'Dashboard',
      accountSettings: 'Account Settings',
      profile: 'Profile',
      security: 'Security',
      billing: 'Billing',
      notifications: 'Notifications',
      formLayouts: 'Form Layouts',
      cards: 'Cards',
      search: 'Search',
      logout: 'Logout',
      roles: 'Roles',
      admin: 'Administration',
      auditLogs: 'Audit Logs',
      position: 'Positions',
      users: 'Users',
      departments: 'Departments',
      employees: 'Employees',
      contracts: 'Contracts',
      hr: 'HR',
      contractTemplates: 'Contract Templates',
      contractStatuses: 'Contract Statuses',
      contractApprovals: 'Contract Approvals',
      management: 'Management',
      configs: 'Configs'
    },
    accountSettings: {
      title: 'Account Settings',
      general: 'General',
      personalInfo: 'Personal Information',
      email: 'Email',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      updateProfile: 'Update Profile',
      deleteAccount: 'Delete Account',
      deleteWarning: 'This action cannot be undone. This will permanently delete your account.'
    },
    roles: {
      title: 'Role Management',
      name: 'NAME',
      addRole: 'Add Role',
      editRole: 'Edit Role',
      deleteRole: 'Delete Role',
      roleNamePlaceholder: 'Enter role name',
      searchRoles: 'Search roles...',
      roleCreated: 'Role created successfully',
      roleUpdated: 'Role updated successfully',
      roleDeleted: 'Role deleted successfully',
      confirmDelete: 'Are you sure you want to delete this role?',
    },
    city: {
      title: 'City Management',
      name: 'NAME',
      addCity: 'Add City',
      editCity: 'Edit City',
      deleteCity: 'Delete City',
      cityNamePlaceholder: 'Enter city name',
      searchCities: 'Search cities...',
      cityCreated: 'City created successfully',
      cityUpdated: 'City updated successfully',
      cityDeleted: 'City deleted successfully',
      confirmDelete: 'Are you sure you want to delete this city?',
    },
    district: {
      title: 'District Management',
      name: 'NAME',
      city: 'CITY',
      addDistrict: 'Add District',
      editDistrict: 'Edit District',
      deleteDistrict: 'Delete District',
      districtNamePlaceholder: 'Enter district name',
      searchDistricts: 'Search districts...',
      districtCreated: 'District created successfully',
      districtUpdated: 'District updated successfully',
      districtDeleted: 'District deleted successfully',
      confirmDelete: 'Are you sure you want to delete this district?',
      selectCity: 'Select city',
    },
    auditLogs: {
      title: 'Audit Logs',
      id: 'ID',
      fullName: 'FULL NAME',
      tableName: 'TABLE',
      recordId: 'RECORD ID',
      oldValue: 'OLD VALUE',
      newValue: 'NEW VALUE',
      timestamp: 'TIMESTAMP',
      searchLogs: 'Search audit logs...',
      noLogsFound: 'No audit logs found',
      details: 'DETAILS',
      viewDetails: 'VIEW DETAILS',
    },
    position: {
      title: 'Position Management',
      name: 'NAME',
      addPosition: 'Add Position',
      editPosition: 'Edit Position',
      deletePosition: 'Delete Position',
      positionNamePlaceholder: 'Enter position name',
      searchPositions: 'Search positions...',
      positionCreated: 'Position created successfully',
      positionUpdated: 'Position updated successfully',
      positionDeleted: 'Position deleted successfully',
      confirmDelete: 'Are you sure you want to delete this position?',
    },
    users: {
      title: 'User Management',
      fullName: 'FULL NAME',
      email: 'EMAIL',
      password: 'PASSWORD',
      confirmPassword: 'CONFIRM PASSWORD',
      role: 'ROLE',
      addUser: 'Add User',
      editUser: 'Edit User',
      lockUser: 'Lock User',
      userNamePlaceholder: 'Enter full name',
      searchUsers: 'Search users...',
      userCreated: 'User created successfully',
      userUpdated: 'User updated successfully',
      userLocked: 'User locked successfully',
      confirmLock: 'Are you sure you want to lock this user?',
      passwordMismatch: 'Passwords do not match',
      passwordRequired: 'Password is required',
      leaveBlankPassword: 'Leave blank if you don\'t want to change the password',
      errorLockMyUser: 'You cannot lock your own account',
      userResetPassword: 'User reset password successfully',
      resetPassword: 'Reset password',
    },
    common: {
      languageSwitch: 'Language',
      save: 'Save',
      cancel: 'Cancel',
      remove: 'Remove',
      search: 'Search',
      filter: 'Clear Filters',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
      active: 'Active',
      inactive: 'Inactive',
      noData: 'No data available',
      actions: 'ACTIONS',
      rowsPerPage: 'Rows per page',
      of: 'of',
      lock: 'Lock',
      status: 'STATUS',
      operationFailed: 'Operation failed. Please try again.',
      deleteFailed: 'Delete operation failed. Please try again.',
      refreshSuccess: 'Refreshed successfully',
      refreshError: 'Failed to refresh data',
      refresh: 'Refresh'
    },
    departments: {
      title: 'Department Management',
      name: 'NAME',
      addDepartment: 'Add Department',
      editDepartment: 'Edit Department',
      deleteDepartment: 'Delete Department',
      departmentNamePlaceholder: 'Enter department name',
      searchDepartments: 'Search departments...',
      departmentCreated: 'Department created successfully',
      departmentUpdated: 'Department updated successfully',
      departmentDeleted: 'Department deleted successfully',
      confirmDelete: 'Are you sure you want to delete this department?',
    },
    employees: {
      title: 'Employee Management',
      fullName: 'FULL NAME',
      numberId: 'ID NUMBER',
      dateOfBirth: 'DATE OF BIRTH',
      sex: 'SEX',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      nationality: 'NATIONALITY',
      placeOfOrigin: 'PLACE OF ORIGIN',
      placeOfResidence: 'PLACE OF RESIDENCE',
      email: 'EMAIL',
      phone: 'PHONE',
      department: 'DEPARTMENT',
      position: 'POSITION',
      hireDate: 'HIRE DATE',
      addEmployee: 'Add Employee',
      editEmployee: 'Edit Employee',
      deleteEmployee: 'Delete Employee',
      employeeNamePlaceholder: 'Enter employee name',
      searchEmployees: 'Search employees...',
      employeeCreated: 'Employee created successfully',
      employeeUpdated: 'Employee updated successfully',
      employeeDeleted: 'Employee deleted successfully',
      confirmDelete: 'Are you sure you want to delete this employee?',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      employmentInfo: 'Employment Information',
      selectDepartment: 'Select department',
      selectPosition: 'Select position',
      salary: 'Salary',
      salaryAllowance: 'Salary Allowance'
    },
    contracts: {
      title: 'Contract Management',
      employee: 'EMPLOYEE',
      employer: 'EMPLOYER',
      template: 'TEMPLATE',
      fileName: 'FILE NAME',
      fileNameEn: 'FILE NAME EN',
      description: 'DESCRIPTION',
      createdBy: 'CREATED BY',
      updatedBy: 'UPDATED BY',
      createdAt: 'CREATED AT',
      updatedAt: 'UPDATED AT',
      addContract: 'Add Contract',
      editContract: 'Edit Contract',
      deleteContract: 'Delete Contract',
      contractNamePlaceholder: 'Enter contract name',
      searchContracts: 'Search contracts...',
      contractCreated: 'Contract created successfully',
      contractUpdated: 'Contract updated successfully',
      contractDeleted: 'Contract deleted successfully',
      confirmDelete: 'Are you sure you want to delete this contract?',
      contractInfo: 'Contract Information',
      selectEmployee: 'Select an employee',
      selectEmployer: 'Select an employer',
      selectTemplate: 'Select a template',
      selectStatus: 'Select a status',
      fileDetails: 'File Details',
      trackingInfo: 'Tracking Information',
      fromDate: 'FROM DATE',
      toDate: 'TO DATE',
      downloadContract: 'Download Contract',
      downloadStarted: 'Download started',
      missingRequiredFields: 'Please fill in all required fields',
      type: 'Contract Type',
      enterContractType: 'Enter contract type'
    },
    contractTemplates: {
      title: 'Contract Template Management',
      fileName: 'FILE NAME',
      fileNameEn: 'FILE NAME EN',
      description: 'DESCRIPTION',
      addContractTemplate: 'Add Contract Template',
      editContractTemplate: 'Edit Contract Template',
      deleteContractTemplate: 'Delete Contract Template',
      contractTemplateNamePlaceholder: 'Enter template file name',
      contractTemplateParamsPlaceholder: 'Enter template parameters',
      searchContractTemplates: 'Search contract templates...',
      contractTemplateCreated: 'Contract template created successfully',
      contractTemplateUpdated: 'Contract template updated successfully',
      contractTemplateDeleted: 'Contract template deleted successfully',
      confirmDelete: 'Are you sure you want to delete this contract template?',
      chosseFile: 'Choose file',
      params: 'Parameters',
      paramsPlaceholder: 'Enter parameters (e.g. name, date, amount)',
      paramsHelper: 'Enter parameters that will be replaced in the template. Use comma to separate multiple parameters.'
    },
    contractStatuses: {
      title: 'Contract Status Management',
      name: 'NAME',
      nameEn: 'NAME (ENGLISH)',
      language: 'LANGUAGE',
      description: 'DESCRIPTION',
      addContractStatus: 'Add Contract Status',
      editContractStatus: 'Edit Contract Status',
      deleteContractStatus: 'Delete Contract Status',
      contractStatusNamePlaceholder: 'Enter status name',
      searchContractStatuses: 'Search contract statuses...',
      contractStatusCreated: 'Contract status created successfully',
      contractStatusUpdated: 'Contract status updated successfully',
      contractStatusDeleted: 'Contract status deleted successfully',
      confirmDelete: 'Are you sure you want to delete this contract status?',
      noContractStatusFound: 'No contract statuses found',
      languagePlaceholder: 'Enter language (e.g., en, vi)'
    },
    configs: {
      title: 'Config Management',
      type: 'Type',
      code: 'Code',
      name: 'Name',
      nameEn: 'Name (English)',
      description: 'Description',
      addConfig: 'Add Config',
      editConfig: 'Edit Config',
      deleteConfig: 'Delete Config',
      configNamePlaceholder: 'Enter config name',
      searchConfigs: 'Search configs...',
      configCreated: 'Config created successfully',
      configUpdated: 'Config updated successfully',
      configDeleted: 'Config deleted successfully',
      confirmDelete: 'Are you sure you want to delete this config?',
      noConfigFound: 'No configs found'
    },
  },
  vi: {
    login: {
      title: 'Chào mừng đến với Company!👋🏻',
      subtitle: 'Vui lòng đăng nhập vào tài khoản và bắt đầu cuộc hành trình',
      email: 'Email',
      password: 'Mật khẩu',
      loginButton: 'Đăng nhập',
      loggingIn: 'Đang đăng nhập...',
      rememberMe: 'Ghi nhớ đăng nhập',
      forgotPassword: 'Quên mật khẩu?',
      newUser: 'Chưa có tài khoản?',
      createAccount: 'Tạo tài khoản',
      invalidCredentials: 'Email hoặc mật khẩu không chính xác',
      networkError: 'Lỗi kết nối, vui lòng kiểm tra lại mạng',
      authFailed: 'Xác thực thất bại'
    },
    register: {
      title: 'Hành trình bắt đầu từ đây 🚀',
      subtitle: 'Làm cho việc quản lý ứng dụng trở nên dễ dàng và thú vị!',
      username: 'Tên đăng nhập',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      terms: 'Điều khoản dịch vụ',
      privacy: 'Chính sách bảo mật',
      agreeTerms: 'Tôi đồng ý với',
      registerButton: 'Đăng ký',
      alreadyHaveAccount: 'Đã có tài khoản?',
      signIn: 'Đăng nhập ngay'
    },
    dashboard: {
      welcome: 'Chào mừng',
      totalUsers: 'Tổng số người dùng',
      totalProfit: 'Tổng lợi nhuận',
      newProject: 'Dự án mới',
      salesOverview: 'Tổng quan bán hàng',
      revenueReport: 'Báo cáo doanh thu',
      weeklyOverview: 'Tổng quan hàng tuần',
      viewAll: 'Xem tất cả',
      viewDetails: 'Xem chi tiết',
      viewReport: 'Xem báo cáo'
    },
    navigation: {
      dashboard: 'Bảng điều khiển',
      accountSettings: 'Cài đặt tài khoản',
      profile: 'Hồ sơ',
      security: 'Bảo mật',
      billing: 'Thanh toán',
      notifications: 'Thông báo',
      formLayouts: 'Bố cục biểu mẫu',
      cards: 'Thẻ',
      search: 'Tìm kiếm',
      logout: 'Đăng xuất',
      roles: 'Vai trò',
      admin: 'Quản trị',
      auditLogs: 'Nhật ký Hoạt động',
      position: 'Cấp bậc',
      users: 'Người dùng',
      departments: 'Phòng ban',
      employees: 'Nhân viên',
      contracts: 'Hợp đồng',
      hr: 'Nhân sự',
      contractTemplates: 'Mẫu hợp đồng',
      contractStatuses: 'Trạng thái hợp đồng',
      contractApprovals: 'Phê duyệt hợp đồng',
      management: 'Quản lý',
      configs: 'Cấu hình'
    },
    accountSettings: {
      title: 'Cài đặt tài khoản',
      general: 'Chung',
      personalInfo: 'Thông tin cá nhân',
      email: 'Email',
      changePassword: 'Thay đổi mật khẩu',
      currentPassword: 'Mật khẩu hiện tại',
      newPassword: 'Mật khẩu mới',
      confirmNewPassword: 'Xác nhận mật khẩu mới',
      updateProfile: 'Cập nhật hồ sơ',
      deleteAccount: 'Xóa tài khoản',
      deleteWarning: 'Hành động này không thể hoàn tác. Tài khoản của bạn sẽ bị xóa vĩnh viễn.'
    },
    roles: {
      title: 'Quản lý quyền',
      name: 'TÊN',
      addRole: 'Thêm quyền',
      editRole: 'Sửa quyền',
      deleteRole: 'Xóa quyền',
      roleNamePlaceholder: 'Nhập tên quyền',
      searchRoles: 'Tìm kiếm quyền...',
      roleCreated: 'Tạo quyền thành công',
      roleUpdated: 'Cập nhật quyền thành công',
      roleDeleted: 'Xóa quyền thành công',
      confirmDelete: 'Bạn có chắc chắn muốn xóa quyền này?',
    },
    city: {
      title: 'Quản lý Thành phố',
      name: 'TÊN',
      addCity: 'Thêm Thành phố',
      editCity: 'Sửa Thành phố',
      deleteCity: 'Xóa Thành phố',
      cityNamePlaceholder: 'Nhập tên thành phố',
      searchCities: 'Tìm kiếm thành phố...',
      cityCreated: 'Tạo thành phố thành công',
      cityUpdated: 'Cập nhật thành phố thành công',
      cityDeleted: 'Xóa thành phố thành công',
      confirmDelete: 'Bạn có chắc chắn muốn xóa thành phố này?',
    },
    district: {
      title: 'Quản lý Quận/Huyện',
      name: 'TÊN',
      city: 'THÀNH PHỐ',
      addDistrict: 'Thêm Quận/Huyện',
      editDistrict: 'Sửa Quận/Huyện',
      deleteDistrict: 'Xóa Quận/Huyện',
      districtNamePlaceholder: 'Nhập tên quận/huyện',
      searchDistricts: 'Tìm kiếm quận/huyện...',
      districtCreated: 'Tạo quận/huyện thành công',
      districtUpdated: 'Cập nhật quận/huyện thành công',
      districtDeleted: 'Xóa quận/huyện thành công',
      confirmDelete: 'Bạn có chắc chắn muốn xóa quận/huyện này?',
      selectCity: 'Chọn thành phố',
    },
    auditLogs: {
      title: 'Nhật ký Hoạt động',
      id: 'ID',
      fullName: 'TÊN NGƯỜI DÙNG',
      tableName: 'BẢNG',
      recordId: 'ID BẢN GHI',
      oldValue: 'GIÁ TRỊ CŨ',
      newValue: 'GIÁ TRỊ MỚI',
      timestamp: 'THỜI GIAN',
      searchLogs: 'Tìm kiếm nhật ký...',
      noLogsFound: 'Không tìm thấy nhật ký nào',
      details: 'CHI TIẾT',
      viewDetails: 'XEM CHI TIẾT',
    },
    position: {
      title: 'Quản lý cấp bậc',
      name: 'TÊN',
      addPosition: 'Thêm cấp bậc',
      editPosition: 'Sửa cấp bậc',
      deletePosition: 'Xóa cấp bậc',
      positionNamePlaceholder: 'Nhập tên cấp bậc',
      searchPositions: 'Tìm kiếm cấp bậc...',
      positionCreated: 'Tạo cấp bậc thành công',
      positionUpdated: 'Cập nhật cấp bậc thành công',
      positionDeleted: 'Xóa cấp bậc thành công',
      confirmDelete: 'Bạn có chắc chắn muốn xóa cấp bậc này?',
    },
    users: {
      title: 'Quản lý Người dùng',
      fullName: 'HỌ TÊN',
      email: 'EMAIL',
      password: 'MẬT KHẨU',
      confirmPassword: 'XÁC NHẬN MẬT KHẨU',
      role: 'VAI TRÒ',
      addUser: 'Thêm Người dùng',
      editUser: 'Sửa Người dùng',
      lockUser: 'Khóa Người dùng',
      userNamePlaceholder: 'Nhập họ tên',
      searchUsers: 'Tìm kiếm người dùng...',
      userCreated: 'Tạo người dùng thành công',
      userUpdated: 'Cập nhật người dùng thành công',
      userLocked: 'Khóa người dùng thành công',
      confirmLock: 'Bạn có chắc chắn muốn khóa người dùng này?',
      passwordMismatch: 'Mật khẩu không khớp',
      passwordRequired: 'Mật khẩu là bắt buộc',
      leaveBlankPassword: 'Để trống nếu bạn không muốn thay đổi mật khẩu',
      errorLockMyUser: 'Bạn không thể xoá người dùng bạn đang đăng nhập',
      userResetPassword: 'Cài đặt lại mật khẩu người dùng thành công',
      resetPassword: 'Cài lại mật khẩu',
    },
    common: {
      languageSwitch: 'Ngôn ngữ',
      save: 'Lưu',
      cancel: 'Hủy',
      remove: 'Xóa',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      loading: 'Đang tải',
      success: 'Thành công',
      error: 'Lỗi',
      warning: 'Cảnh báo',
      info: 'Thông tin',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      noData: 'Không có dữ liệu',
      actions: 'THAO TÁC',
      rowsPerPage: 'Số dòng mỗi trang',
      of: 'của',
      lock: 'Khoá',
      status: 'TRẠNG THÁI',
      operationFailed: 'Thao tác thất bại. Vui lòng thử lại.',
      deleteFailed: 'Xóa thất bại. Vui lòng thử lại.',
      refreshSuccess: 'Làm mới thành công',
      refreshError: 'Làm mới thất bại',
      refresh: 'Làm mới'
    },
    departments: {
      title: 'Quản lý Phòng ban',
      name: 'TÊN',
      addDepartment: 'Thêm Phòng ban',
      editDepartment: 'Sửa Phòng ban',
      deleteDepartment: 'Xóa Phòng ban',
      departmentNamePlaceholder: 'Nhập tên phòng ban',
      searchDepartments: 'Tìm kiếm phòng ban...',
      departmentCreated: 'Tạo phòng ban thành công',
      departmentUpdated: 'Cập nhật phòng ban thành công',
      departmentDeleted: 'Xóa phòng ban thành công',
      confirmDelete: 'Bạn có chắc chắn muốn xóa phòng ban này?',
    },
    employees: {
      title: 'Quản lý Nhân viên',
      fullName: 'HỌ TÊN',
      numberId: 'SỐ CMND/CCCD',
      dateOfBirth: 'NGÀY SINH',
      sex: 'GIỚI TÍNH',
      male: 'Nam',
      female: 'Nữ',
      other: 'Khác',
      nationality: 'QUỐC TỊCH',
      placeOfOrigin: 'NGUYÊN QUÁN',
      placeOfResidence: 'NƠI Ở HIỆN TẠI',
      email: 'EMAIL',
      phone: 'ĐIỆN THOẠI',
      department: 'PHÒNG BAN',
      position: 'VỊ TRÍ',
      hireDate: 'NGÀY VÀO LÀM',
      addEmployee: 'Thêm Nhân viên',
      editEmployee: 'Sửa Nhân viên',
      deleteEmployee: 'Xóa Nhân viên',
      employeeNamePlaceholder: 'Nhập tên nhân viên',
      searchEmployees: 'Tìm kiếm nhân viên...',
      employeeCreated: 'Tạo nhân viên thành công',
      employeeUpdated: 'Cập nhật nhân viên thành công',
      employeeDeleted: 'Xóa nhân viên thành công',
      confirmDelete: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      personalInfo: 'Thông tin cá nhân',
      contactInfo: 'Thông tin liên hệ',
      employmentInfo: 'Thông tin công việc',
      selectDepartment: 'Chọn phòng ban',
      selectPosition: 'Chọn cấp bậc',
      salary: 'Lương',
      salaryAllowance: 'Phụ cấp'
    },
    contracts: {
      title: 'Quản lý hợp đồng',
      employee: 'NHÂN VIÊN',
      employer: 'NHÀ TUYỂN DỤNG',
      template: 'MẪU',
      fileName: 'TÊN FILE',
      fileNameEn: 'TÊN FILE (TIẾNG ANH)',
      description: 'MÔ TẢ',
      createdBy: 'TẠO BỞI',
      updatedBy: 'CẬP NHẬT BỞI',
      createdAt: 'NGÀY TẠO',
      updatedAt: 'NGÀY CẬP NHẬT',
      addContract: 'Thêm hợp đồng',
      editContract: 'Sửa hợp đồng',
      deleteContract: 'Xóa hợp đồng',
      contractNamePlaceholder: 'Nhập tên hợp đồng',
      searchContracts: 'Tìm kiếm hợp đồng...',
      contractCreated: 'Đã tạo hợp đồng thành công',
      contractUpdated: 'Đã cập nhật hợp đồng thành công',
      contractDeleted: 'Đã xóa hợp đồng thành công',
      confirmDelete: 'Bạn có chắc muốn xóa hợp đồng này?',
      contractInfo: 'Thông tin hợp đồng',
      selectEmployee: 'Chọn nhân viên',
      selectEmployer: 'Chọn nhà tuyển dụng',
      selectTemplate: 'Chọn mẫu',
      selectStatus: 'Chọn trạng thái',
      fileDetails: 'Chi tiết file',
      trackingInfo: 'Thông tin theo dõi',
      fromDate: 'TỪ NGÀY',
      toDate: 'ĐẾN NGÀY',
      downloadContract: 'Tải hợp đồng',
      downloadStarted: 'Đã bắt đầu tải xuống',
      missingRequiredFields: 'Vui lòng điền đầy đủ các trường bắt buộc',
      type: 'Loại hợp đồng',
      enterContractType: 'Nhập loại hợp đồng'
    },
    contractTemplates: {
      title: 'Quản lý Mẫu Hợp đồng',
      fileName: 'TÊN TỆP',
      fileNameEn: 'TÊN TỆP TIẾNG ANH',
      description: 'MÔ TẢ',
      addContractTemplate: 'Thêm Mẫu Hợp đồng',
      editContractTemplate: 'Sửa Mẫu Hợp đồng',
      deleteContractTemplate: 'Xóa Mẫu Hợp đồng',
      contractTemplateNamePlaceholder: 'Nhập tên tệp mẫu',
      contractTemplateParamsPlaceholder: 'Nhập tham số mẫu',
      searchContractTemplates: 'Tìm kiếm mẫu hợp đồng...',
      contractTemplateCreated: 'Tạo mẫu hợp đồng thành công',
      contractTemplateUpdated: 'Cập nhật mẫu hợp đồng thành công',
      contractTemplateDeleted: 'Xóa mẫu hợp đồng thành công',
      confirmDelete: 'Bạn có chắc chắn muốn xóa mẫu hợp đồng này?',
      chosseFile: 'Chọn tệp',
      params: 'THAM SỐ',
      paramsPlaceholder: 'Nhập tham số (ví dụ: tên, ngày, số tiền)',
      paramsHelper: 'Nhập tham số sẽ được thay thế trong mẫu. Sử dụng dấu phẩy để phân cách nhiều tham số.'
    },
    contractStatuses: {
      title: 'Quản lý Trạng thái hợp đồng',
      name: 'TÊN',
      nameEn: 'TÊN TIẾNG ANH',
      language: 'NGÔN NGỮ',
      description: 'MÔ TẢ',
      addContractStatus: 'Thêm Trạng thái hợp đồng',
      editContractStatus: 'Sửa Trạng thái hợp đồng',
      deleteContractStatus: 'Xóa Trạng thái hợp đồng',
      contractStatusNamePlaceholder: 'Nhập tên trạng thái',
      searchContractStatuses: 'Tìm kiếm trạng thái hợp đồng...',
      contractStatusCreated: 'Trạng thái hợp đồng được tạo thành công',
      contractStatusUpdated: 'Trạng thái hợp đồng được cập nhật thành công',
      contractStatusDeleted: 'Trạng thái hợp đồng được xóa thành công',
      confirmDelete: 'Bạn có chắc chắn muốn xóa trạng thái hợp đồng này?',
      noContractStatusFound: 'Không tìm thấy trạng thái hợp đồng nào',
      languagePlaceholder: 'Nhập ngôn ngữ (ví dụ: en, vi)'
    },
    configs: {
      title: 'Cấu hình',
      type: 'Loại',
      code: 'Mã',
      name: 'Tên',
      nameEn: 'Tên (Tiếng Anh)',
      description: 'Mô tả',
      addConfig: 'Thêm cấu hình',
      editConfig: 'Sửa cấu hình',
      deleteConfig: 'Xóa cấu hình',
      configNamePlaceholder: 'Nhập tên cấu hình',
      searchConfigs: 'Tìm kiếm cấu hình...',
      configCreated: 'Cấu hình được tạo thành công',
      configUpdated: 'Cấu hình được cập nhật thành công',
      configDeleted: 'Cấu hình được xóa thành công',
      confirmDelete: 'Bạn có chắc chắn muốn xóa cấu hình này?',
      noConfigFound: 'Không tìm thấy cấu hình nào'
    },
  }
};
