import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import userData from "../data/empleado.js";
import classNames from "classnames";
import { info } from "autoprefixer";

const Datatable = () => {
  const [data, setData] = useState(userData);
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
            "text-white px-2 rounded-full font-semibold text-center": true,
            "bg-red-500 py-1": info.getValue() === "inactive",
            "bg-green-500 py-1": info.getValue() === "active",
          })}
        >
          {info.getValue()}
        </span>
      ),
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="px-6 py-4">
      <table className="table-auto w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-gray-300 text-gray-600 bg-gray-100"
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
            className="text-gray-600 bg-gray-200 py-0.5 px-1 rounded border border-gray-50"
            onClick={() => table.setPageIndex(0)}
          >
            {"<<"}
          </button>
          <button
            className="text-gray-600 bg-gray-200 py-0.5 px-1 rounded border border-gray-50 disabled:bg-white disabled:text-gray-300"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          {table.getPageOptions().map((value, key) => (
            <button
              key={key}
              className={classNames({
                "text-gray-600 bg-gray-200 py-0.5 px-2 font-bold rounded border border-gray-50 disabled:bg-white disabled:text-gray-300": true,
                "bg-indigo-200 text-indigo-700":
                  value === table.getState().pagination.pageIndex,
              })}
              onClick={() => table.setPageIndex(value)}
            >
              {value + 1}
            </button>
          ))}
          <button
            className="text-gray-600 bg-gray-200 py-0.5 px-1 rounded border border-gray-50 disabled:bg-white disabled:text-gray-300"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="text-gray-600 bg-gray-200 py-0.5 px-1 rounded border border-gray-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            {">>"}
          </button>
        </div>

        <div className="text-gray-600 font-semibold">
          <select
            className="text-gray-600 border border-gray-300 rounded outline-indigo-700 mr-4"
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            <option value="10">10 Pag.</option>
            <option value="20">20 Pag.</option>
            <option value="25">25 Pag.</option>
            <option value="50">50 Pag.</option>
          </select>
          {`Mostrando de ${Number(table.getRowModel().rows[0].id) + 1} a ${
            Number(
              table.getRowModel().rows[table.getRowModel().rows.length - 1].id
            ) + 1
          } del total de ${userData.length} registros`}
        </div>
      </div>
    </div>
  );
};

export default Datatable;
