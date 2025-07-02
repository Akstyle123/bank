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

  async uploadFile(file: File, type: 'holder' | 'admin' | 'clientRequest', metadata: Record<string, string>): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return await response.text();
  }
}

export const apiService = new ApiService();