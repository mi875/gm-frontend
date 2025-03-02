import { Badge } from "@/components/ui/badge";

export const AdminBadge = ({ isAdmin }: { isAdmin: boolean }) => {
    return isAdmin ? (
        <Badge
            variant="default"
            className="w-fit bg-rose-500 dark:bg-rose-400 dark:hover:bg-rose-400 hover:bg-red-500"
        >
            管理者
        </Badge>
    ) : (
        <Badge
            variant="default"
            className="w-fit bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-400 hover:bg-emerald-500"
        >
            一般
        </Badge>
    );
};
