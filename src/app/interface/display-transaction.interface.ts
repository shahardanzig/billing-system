export interface DisplayTransaction {
    _id: string,
    customer_id: string,
    customer_name: string;
    customer_email: string;
    total_price: number;
    currency: string;
    cerdit_card_type: string;
    cerdit_card_number: number;
}