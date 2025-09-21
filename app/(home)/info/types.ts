export interface Organization {
   id: number;
   name: string;
   logo: string | null;
 }
 
 export interface OrganizationData {
   id: number;
   name: string;
   organization: Organization;
 }
 
 export interface GiftItem {
   id: number;
   name: string;
   image: string;
   lucky_draw_system: number;
 }
 
export interface SubmissionResponse {
  customer_name: string;
  date_of_purchase: string;
  gift: GiftItem | null | GiftItem[];
  imei: string;
  phone_model: string;
  phone_number: string;
  shop_name: string;
  sold_area: string;
}

 export interface ErrorResponse {
  error: string;
}
 
 export interface FormData {
  customer_name: string;
  phone_number: string;
  email?: string;
  shop_name: string;
  sold_area: string;
  region?: string;
  imei: string;
  how_know_about_campaign: string;
  other_campaign_source?: string;
  profession: string;
  other_profession?: string;
}