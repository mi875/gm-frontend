export interface GoodData{
    good_id: string;
    space_id: string;
    add_email: string;
    good_name: string;
    can_borrow: boolean;
    status: boolean;
    description: string;
    who_borrow_uid: string;
    who_borrow_name: string;
    who_return_uid: string;
    who_return_name: string;
    when_borrow: Date;
}