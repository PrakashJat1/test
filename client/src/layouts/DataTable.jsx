import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Pencil,
  PlusSquare,
  CheckCheck,
} from "lucide-react";
import React, { useState } from "react";

const DataTable = ({
  title,
  data,
  columns,
  showSelection = false,
  deleteButton = false,
  approveButton = false,
  rejectButton = false,
  activeButton = false,
  suspendButton = false,
  assignBatchButton = false,
  placementButton = false,
  finalSelectionButton = false,
  addButton = false,
  applicantSelectButton = false,
  onDelete,
  onApprove,
  onReject,
  onActive,
  onSuspend,
  onAssignBatch,
  onAdd,
  onApplicantSelect,
  onPlacementUpdate,
  onFinalSelection,
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [grouping, setGrouping] = useState([]);
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
      expanded,
      sorting,
      globalFilter,
    },
    getGroupedRowModel: getGroupedRowModel(),
    onGroupingChange: setGrouping,
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const toggleRow = (rowId, rowData) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[rowId]) {
        delete updated[rowId];
      } else {
        updated[rowId] = rowData;
      }
      return updated;
    });
  };

  const selectedRowData = Object.values(selectedRows);

  return (
    <div className="container-fluid my-4">
      {/* Title + Action Bar */}
      <div
        className="sticky-top bg-white py-2 px-2"
        style={{ zIndex: 1020, top: "0px", borderBottom: "1px solid #dee2e6" }} // Adjust `top` based on your header height
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          {/* Search */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <Search size={35} />
            <input
              type="text"
              className="form-control"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              style={{ width: "150%" }}
            />
          </div>

          {title && <h5 className="fw-semibold fs-4 mb-lg-2">{title}</h5>}

          <div className="btn-group">
            {addButton && (
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => onAdd?.(selectedRowData)}
              >
                <PlusSquare size={16} className="me-1" />
                Add New One
              </button>
            )}
            {approveButton && (
              <button
                className="btn btn-outline-success btn-sm"
                disabled={selectedRowData.length === 0}
                onClick={() => onApprove?.(selectedRowData)}
              >
                <CheckCircle2 size={16} className="me-1" />
                Approve
              </button>
            )}
            {finalSelectionButton && (
              <button
                className="btn btn-outline-success btn-sm"
                disabled={selectedRowData.length === 0}
                onClick={() => onFinalSelection?.(selectedRowData)}
              >
                <CheckCircle2 size={16} className="me-1" />
                Final Selection
              </button>
            )}
            {placementButton && (
              <button
                className="btn btn-outline-success btn-sm"
                disabled={selectedRowData.length === 0}
                onClick={() => onPlacementUpdate?.(selectedRowData)}
              >
                <CheckCheck size={16} className="me-1" />
                Update Placement Status
              </button>
            )}
            {assignBatchButton && (
              <button
                className="btn btn-outline-success btn-sm"
                disabled={selectedRowData.length === 0}
                onClick={() => onAssignBatch?.(selectedRowData)}
              >
                <Pencil size={16} className="me-1" />
                Assign Batch
              </button>
            )}
            {activeButton && (
              <button
                className="btn btn-outline-success btn-sm"
                disabled={selectedRowData.length === 0}
                onClick={() => onActive?.(selectedRowData)}
              >
                <CheckCircle2 size={16} className="me-1" />
                Active
              </button>
            )}
            {suspendButton && (
              <button
                className="btn btn-outline-warning btn-sm"
                disabled={selectedRowData.length === 0}
                onClick={() => onSuspend?.(selectedRowData)}
              >
                <XCircle size={16} className="me-1" />
                Suspend
              </button>
            )}
            {rejectButton && (
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={selectedRowData.length === 0}
                onClick={() => onReject?.(selectedRowData)}
              >
                <XCircle size={16} className="me-1" />
                Reject
              </button>
            )}
            {deleteButton && (
              <button
                // disabled
                className="btn btn-outline-danger btn-sm"
                disabled={selectedRowData.length === 0}
                onClick={() => onDelete?.(selectedRowData)}
              >
                <Trash2 size={16} className="me-1" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-light text-nowrap">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {showSelection &&
                  headerGroup.id === table.getHeaderGroups()[0].id && (
                    <th
                      className="text-center align-middle"
                      style={{ width: "50px" }}
                    >
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const newSelection = {};
                          if (checked) {
                            table.getRowModel().rows.forEach((row) => {
                              newSelection[row.id] = row.original;
                            });
                          }
                          setSelectedRows(checked ? newSelection : {});
                        }}
                        checked={
                          Object.keys(selectedRows).length ===
                          table.getRowModel().rows.length
                        }
                      />
                    </th>
                  )}
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-center align-middle">
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "d-flex justify-content-center align-items-center gap-2 user-select-none fw-semibold text-secondary"
                          : "d-flex justify-content-center align-items-center gap-2",
                        onClick: header.column.getToggleSortingHandler(),
                        style: { cursor: "pointer" },
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <ArrowUpDown size={14} className="text-muted" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {showSelection && (
                  <td className="text-center align-middle">
                    <input
                      type="checkbox"
                      checked={!!selectedRows[row.id]}
                      onChange={() => toggleRow(row.id, row.original)}
                    />
                  </td>
                )}
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="text-center align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
        <div>
          <span className="me-2">Items per page:</span>
          <select
            className="form-select d-inline w-auto"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 30].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} />
          </button>

          <span className="d-flex align-items-center gap-2">
            <input
              type="number"
              min={1}
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="form-control form-control-sm w-50"
            />
            <span className="small">of {table.getPageCount()}</span>
          </span>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} />
          </button>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
