import { InquiryData } from '../services/request-formatter.js';

export interface SessionData {
  inquiryData: InquiryData;
  currentScene: string | null;
}
