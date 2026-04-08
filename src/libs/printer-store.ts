// This stays on the server to hold the last "printed" data
export const printerStore = {
  lastReceipt: [] as string[],
  
  setReceipt(lines: string[]) {
    this.lastReceipt = lines;
  },
  
  getReceipt() {
    return this.lastReceipt;
  }
};