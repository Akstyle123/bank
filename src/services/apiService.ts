const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbw_DA5HitD3fHZMZbR4BLT_quN2l_E3K7Vv-3cM3TKvID9YjW2tAeKsY2af329tKQBHTQ/exec';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

class ApiService {
  private async makeRequest(params: Record<string, string>): Promise<string> {
    const url = new URL(API_BASE_URL);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  }

  private async makePostRequest(formData: FormData): Promise<any> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, message: text };
    }
  }

  async login(email: string, password: string, action: string): Promise<string> {
    return this.makeRequest({
      action,
      email,
      password
    });
  }

  async verifyOTP(email: string, otp: string, action: string): Promise<string> {
    return this.makeRequest({
      action,
      email,
      otp
    });
  }

  async logout(email: string, action: string): Promise<string> {
    return this.makeRequest({
      action,
      email
    });
  }

  async addHolder(holderData: {
    fullname: string;
    mob: string;
    email: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'addholder',
      ...holderData
    });
  }

  async editHolder(holderData: {
    hid: string;
    fullname?: string;
    mob?: string;
    email?: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'editholder',
      ...holderData
    });
  }

  async removeHolder(holderData: {
    hid: string;
    email: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'removeholder',
      ...holderData
    });
  }

  async deposit(depositData: {
    hid: string;
    damount: string;
    note: string;
    email: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'deposit',
      ...depositData
    });
  }

  async withdraw(withdrawData: {
    hid: string;
    wamount: string;
    camount: string;
    note: string;
    email: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'withdraw',
      ...withdrawData
    });
  }

  async addPenalty(penaltyData: {
    hid: string;
    pamount: string;
    reason: string;
    email: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'addPenalty',
      ...penaltyData
    });
  }

  async addDailyCollection(collectionData: {
    hid: string;
    amount: string;
    collectedBy: string;
    note: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'addDailyCollection',
      ...collectionData
    });
  }

  async readHolders(): Promise<string> {
    return this.makeRequest({
      action: 'readholders'
    });
  }

  async readLogs(): Promise<string> {
    return this.makeRequest({
      action: 'readlogs'
    });
  }

  async getBankStatus(): Promise<string> {
    return this.makeRequest({
      action: 'getBankStatus'
    });
  }

  async getDailyCollection(date: string): Promise<string> {
    return this.makeRequest({
      action: 'daily',
      date
    });
  }

  async getSummary(): Promise<string> {
    return this.makeRequest({
      action: 'summary'
    });
  }

  async clientTransactions(filter: {
    name?: string;
    email?: string;
    mobile?: string;
    hid?: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'clientTransactions',
      ...filter
    });
  }

  async clientRequest(requestData: {
    name: string;
    email: string;
    mobile: string;
    message: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'clientRequest',
      ...requestData
    });
  }

  async readClientRequests(): Promise<string> {
    return this.makeRequest({
      action: 'readClientRequests'
    });
  }

  async changePassword(passwordData: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'changePassword',
      ...passwordData
    });
  }

  async addAdmin(adminData: {
    email: string;
    password: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'addAdmin',
      ...adminData
    });
  }

  async editAdmin(adminData: {
    email: string;
    newPassword: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'editAdmin',
      ...adminData
    });
  }

  async removeAdmin(adminData: {
    email: string;
  }): Promise<string> {
    return this.makeRequest({
      action: 'removeAdmin',
      ...adminData
    });
  }

  // File Upload Methods
  async uploadHolderProfile(file: File, holderId: string, holderName: string): Promise<any> {
    const formData = new FormData();
    
    // Convert file to base64
    const base64 = await this.fileToBase64(file);
    
    formData.append('type', 'holder');
    formData.append('uploadType', 'profile');
    formData.append('holderId', holderId);
    formData.append('holderName', holderName);
    formData.append('file', base64);
    formData.append('filename', file.name);
    formData.append('contentType', file.type);

    return this.makePostRequest(formData);
  }

  async uploadHolderDocument(file: File, holderId: string, holderName: string): Promise<any> {
    const formData = new FormData();
    
    // Convert file to base64
    const base64 = await this.fileToBase64(file);
    
    formData.append('type', 'holder');
    formData.append('uploadType', 'document');
    formData.append('holderId', holderId);
    formData.append('holderName', holderName);
    formData.append('file', base64);
    formData.append('filename', file.name);
    formData.append('contentType', file.type);

    return this.makePostRequest(formData);
  }

  async uploadAdminProfile(file: File, adminEmail: string): Promise<any> {
    const formData = new FormData();
    
    // Convert file to base64
    const base64 = await this.fileToBase64(file);
    
    formData.append('type', 'admin');
    formData.append('uploadType', 'profile');
    formData.append('adminEmail', adminEmail);
    formData.append('file', base64);
    formData.append('filename', file.name);
    formData.append('contentType', file.type);

    return this.makePostRequest(formData);
  }

  async uploadAdminDocument(file: File, adminEmail: string): Promise<any> {
    const formData = new FormData();
    
    // Convert file to base64
    const base64 = await this.fileToBase64(file);
    
    formData.append('type', 'admin');
    formData.append('uploadType', 'document');
    formData.append('adminEmail', adminEmail);
    formData.append('file', base64);
    formData.append('filename', file.name);
    formData.append('contentType', file.type);

    return this.makePostRequest(formData);
  }

  async uploadClientRequestFile(file: File, holderId: string, requestId: string, clientName: string): Promise<any> {
    const formData = new FormData();
    
    // Convert file to base64
    const base64 = await this.fileToBase64(file);
    
    formData.append('type', 'clientRequest');
    formData.append('holderId', holderId);
    formData.append('requestId', requestId);
    formData.append('clientName', clientName);
    formData.append('file', base64);
    formData.append('filename', file.name);
    formData.append('contentType', file.type);

    return this.makePostRequest(formData);
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/jpeg;base64, part
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Message System APIs
  async adminSendMessageWithTemplate(params: {
    template: string;
    targetType: string;
    targetHID?: string;
    targetEmail?: string;
    sentBy: string;
    priority?: string;
  }): Promise<any> {
    return this.makeRequest({
      action: 'adminSendMessageWithTemplate',
      ...params
    });
  }

  async getInbox(params: {
    email: string;
    role: string;
  }): Promise<any> {
    const response = await this.makeRequest({
      action: 'getInbox',
      ...params
    });
    try {
      return JSON.parse(response);
    } catch {
      return { success: false, message: response };
    }
  }

  async getClientBadgeCount(params: { hid: string }): Promise<any> {
    const response = await this.makeRequest({
      action: 'getClientBadgeCount',
      ...params
    });
    try {
      return JSON.parse(response);
    } catch {
      return { count: 0 };
    }
  }

  async getAdminBadgeCount(): Promise<any> {
    const response = await this.makeRequest({
      action: 'getAdminBadgeCount'
    });
    try {
      return JSON.parse(response);
    } catch {
      return { count: 0 };
    }
  }

  async getClientNotifications(params: { hid: string }): Promise<any> {
    const response = await this.makeRequest({
      action: 'getClientNotifications',
      ...params
    });
    try {
      return JSON.parse(response);
    } catch {
      return { success: false, notifications: [] };
    }
  }

  async markClientNotificationsSeen(params: { hid: string }): Promise<any> {
    const response = await this.makeRequest({
      action: 'markClientNotificationsSeen',
      ...params
    });
    try {
      return JSON.parse(response);
    } catch {
      return { success: false };
    }
  }

  async getAdminNotifications(): Promise<any> {
    const response = await this.makeRequest({
      action: 'getAdminNotifications'
    });
    try {
      return JSON.parse(response);
    } catch {
      return { success: false, notifications: [] };
    }
  }

  async getMessageTemplates(): Promise<any> {
    const response = await this.makeRequest({
      action: 'getMessageTemplates'
    });
    try {
      return JSON.parse(response);
    } catch {
      return { success: false, templates: [] };
    }
  }
}

export const apiService = new ApiService();