import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import userData from "../data/empleado.js";
import classNames from "classnames";
import { rankItem } from "@tanstack/match-sorter-utils";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });

  return itemRank.passed;
};

const DebouncedInput = ({ value: keyWord, onChange, ...props }) => {
  const [value, setValue] = useState(keyWord);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
const Datatable = () => {
  const [data, setData] = useState(userData);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      accessorKey: "name",
      header: () => <span>Nombre</span>,
      cell: (info) => (
        <span className="font-bold text-blue-600">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "lastName",
      header: () => <span>Apellido</span>,
    },

    {
      accessorKey: "company",
      header: () => <span>Compañia</span>,
    },
    {
      accessorKey: "status",
      header: () => <span>Estado</span>,
      cell: (info) => (
        <span
          className={classNames({
            "rounded-full px-2 text-center font-semibold text-white": true,
            "bg-red-500 py-1": info.getValue() === "inactive",
            "bg-green-500 py-1": info.getValue() === "active",
          })}
        >
          {info.getValue()}
        </span>
      ),
    },
  ];

  const getStateTable = () => {
    const totalRows = table.getFilteredRowModel().rows.length;
    const pageSize = table.getState().pagination.pageSize;
    const pageIndex = table.getState().pagination.pageIndex;
    const rowsPerPage = table.getRowModel().rows.length;
    const firstIndex = pageIndex * pageSize + 1;
    const lastIndex = pageIndex * pageSize + rowsPerPage;

    return { totalRows, firstIndex, lastIndex };
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    // initialState: {
    //   pagination: {
    //     pageSize: 5
    //   }
    // },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
  });

  return (
    <div className="px-6 py-4">
      <div className="my-2 text-right">
        <DebouncedInput
          className="mr-4 rounded border border-gray-300 p-2 text-gray-600 outline-indigo-700"
          type="text"
          placeholder="Buscar..."
          onChange={(value) => setGlobalFilter(String(value))}
          value={globalFilter ?? ""}
        />
      </div>
      <table className="w-full table-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-gray-300 bg-gray-100 text-gray-600"
            >
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="py-2 px-4 text-left uppercase">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="text-gray-600 hover:bg-slate-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-2 px-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="rounded border border-gray-50 bg-gray-200 py-0.5 px-1 text-gray-600"
            onClick={() => table.setPageIndex(0)}
          >
            {"<<"}
          </button>
          <button
            className="rounded border border-gray-50 bg-gray-200 py-0.5 px-1 text-gray-600 disabled:bg-white disabled:text-gray-300"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          {table.getPageOptions().map((value, key) => (
            <button
              key={key}
              className={classNames({
                "rounded border border-gray-50 bg-gray-200 py-0.5 px-2 font-bold text-gray-600 disabled:bg-white disabled:text-gray-300": true,
                "bg-indigo-200 text-indigo-700":
                  value === table.getState().pagination.pageIndex,
              })}
              onClick={() => table.setPageIndex(value)}
            >
              {value + 1}
            </button>
          ))}
          <button
            className="rounded border border-gray-50 bg-gray-200 py-0.5 px-1 text-gray-600 disabled:bg-white disabled:text-gray-300"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="rounded border border-gray-50 bg-gray-200 py-0.5 px-1 text-gray-600"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            {">>"}
          </button>
        </div>

        <div className="font-semibold text-gray-600">
          {table.getRowModel().rows[0]?.id ? (
            <>
              {`Mostrando de ${Number(getStateTable().firstIndex)} a ${Number(
                getStateTable().lastIndex
              )} del total de ${getStateTable().totalRows} registros`}
            </>
          ) : (
            <>{`No hay registro que coincida con tu busqueda`}</>
          )}
        </div>
        <select
          className="mr-4 rounded border border-gray-300 text-gray-600 outline-indigo-700"
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          <option value="10">10 Pag.</option>
          <option value="20">20 Pag.</option>
          <option value="25">25 Pag.</option>
          <option value="50">50 Pag.</option>
        </select>
      </div>
    </div>
  );
};

export default Datatable;
