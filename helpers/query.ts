import { PostgrestQueryBuilder, PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface PaginatedData<T=any> {
    data: T[];
    page: number;
    total: number;
    isPaginated: boolean,
}


type Operator = "eq" | "ilike" | "gt" | "gte" | "lt" | "lte" | "neq";

const operatorMap: Record<string, Operator> = {
    like: "ilike",
    gt: "gt",
    gte: "gte",
    lt: "lt",
    lte: "lte",
    neq: "neq",
};

// given query params as "field1=exactvalue&field2=value:like&field3=40&field4=30:gt&sort=field5:desc&page=1&max=12&with=table2:field1,field2"
// means: field1="exactvalue" & field2=%value% & field3=30 & field4 > 30 & sort by field5 desc & get page 1 with maximum of 12 items
// assume q is supabase.from(table_name).select(...)
export async function filterQuery(
    q: PostgrestQueryBuilder<any, any, any>,
    params: URLSearchParams,
    defaultSelect: string = "*"
): Promise<PaginatedData> {
    /* ---------------------------------------------------
       1. Build JOIN string from "with="
       ---------------------------------------------------*/
    const joins = params.getAll("with"); // allow multiple: ?with=a:x,y&with=b:z
    let selectString = defaultSelect;

    if (joins.length > 0) {
        const joinParts = joins.map((j) => {
            const [table, fields] = j.split(":");
            return `${table}(${fields})`;
        });

        // Build:  select("*, table1(a,b), table2(c)")
        selectString = `${defaultSelect}, ${joinParts.join(", ")}`;
    }

    let filterBuilder: PostgrestFilterBuilder<any, any, any, any> = q.select(selectString);

    /* ---------------------------------------------------
       2. Pagination
       ---------------------------------------------------*/
    const page = Number(params.get("page") ?? 0);
    const max = Number(params.get("max") ?? 0);
    const doPagination = page > 0 && max > 0;

    /* ---------------------------------------------------
       3. Sorting
       ---------------------------------------------------*/
    const sortRaw = params.get("sort");

    /* ---------------------------------------------------
       4. Field filters
       ---------------------------------------------------*/
    params.forEach((value, key) => {
        if (["page", "max", "sort", "with"].includes(key)) return;

        let [val, op] = value.split(":");
        if (!op) op = "eq";

        const operator = operatorMap[op] ?? "eq";

        if (operator === "ilike") {
            filterBuilder = filterBuilder.ilike(key, `%${val}%`);
        } else {
            filterBuilder = filterBuilder.filter(key, operator, val);
        }
    });

    /* ---------------------------------------------------
       5. Apply sorting
       ---------------------------------------------------*/
    if (sortRaw) {
        const [field, direction] = sortRaw.split(":");
        filterBuilder = filterBuilder.order(field, {
            ascending: direction !== "desc",
        });
    }

    /* ---------------------------------------------------
       6. Pagination query
       ---------------------------------------------------*/
    if (doPagination) {
        const from = (page - 1) * max;
        const to = from + max - 1;

        const { data, count, error } = await filterBuilder.range(from, to);

        if (error) throw error;

        return {
            data: data ?? [],
            total: count ?? 0,
            page,
            isPaginated: true,
        };
    }

    /* ---------------------------------------------------
       7. Non-paginated query
       ---------------------------------------------------*/
    const { data, error } = await q.select(selectString);

    if (error) throw error;

    return { data: data, isPaginated: false, page: 0, total: data.length };
}
