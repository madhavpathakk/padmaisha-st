export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  gst_no: string;
  status: {
    contacted: boolean;
    fulfilled: boolean;
    order_placed: boolean;
    notes: string;
  };
  order_details?: {
    items: any[];
    total_amount: number;
    date: any;
  };
  created_at?: any;
  updated_at?: any;
};
