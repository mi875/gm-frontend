import { GoodData } from "@/components/types/good";
import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ goodData }: { goodData: GoodData }) => {
    return goodData.can_borrow && goodData.status === true ? (
        <Badge
            variant="default"
            className="w-fit bg-rose-500 dark:bg-rose-400 dark:hover:bg-rose-400 hover:bg-red-500"
        >
            {goodData.who_borrow_name}
            が借りています
        </Badge>
    ) : (
        <Badge
            variant="default"
            className="w-fit bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-400 hover:bg-emerald-500"
        >
            貸出可
        </Badge>
    );
};
