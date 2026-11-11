import React, { useEffect, useRef } from 'react';
import { FolderOpen, Trash2, X } from 'lucide-react';
import type { CalendarDesign, PrintOrderItem } from '../types/calendar';
import { formatVnd, STYLES } from '../data/calendarCatalog';
import { Button } from './ui';

interface SavedProjectsModalProps {
  open: boolean;
  onClose: () => void;
  savedProjects: CalendarDesign[];
  orders: PrintOrderItem[];
  onLoadProject: (project: CalendarDesign) => void;
  onDeleteProject: (id: string) => void;
}

export const SavedProjectsModal: React.FC<SavedProjectsModalProps> = ({
  open,
  onClose,
  savedProjects,
  orders,
  onLoadProject,
  onDeleteProject,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-labelledby="saved-modal-title"
      className="m-auto w-[min(94vw,44rem)] rounded-card border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-black/45"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <h2 id="saved-modal-title" className="font-display text-xl font-semibold text-foreground">
          Mẫu thiết kế &amp; đơn đặt in đã lưu
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng hộp thoại"
          className="inline-flex items-center justify-center w-9 h-9 rounded-control text-muted hover:text-foreground hover:bg-background cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-6 max-h-[75dvh] overflow-y-auto">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Thiết kế đã lưu ({savedProjects.length})
          </h3>
          {savedProjects.length === 0 ? (
            <p className="text-sm text-muted py-3">
              Chưa có thiết kế nào được lưu. Bạn có thể bấm “Lưu mẫu thiết kế” ở Bước 4 hoặc trên thanh công cụ.
            </p>
          ) : (
            <div className="divide-y divide-border/70">
              {savedProjects.map((proj) => {
                const styleName = STYLES.find((s) => s.id === proj.styleId)?.name ?? proj.styleId;
                return (
                  <div
                    key={proj.id}
                    className="py-3 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {proj.projectName}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {proj.calendarType === 'desk' ? 'Lịch Để Bàn' : 'Lịch Treo Tường'} · Năm{' '}
                        {proj.year} · {styleName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        tone="quiet"
                        onClick={() => {
                          onLoadProject(proj);
                          onClose();
                        }}
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Mở mẫu</span>
                      </Button>
                      <button
                        type="button"
                        onClick={() => onDeleteProject(proj.id)}
                        aria-label={`Xóa mẫu ${proj.projectName}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-control border border-border text-muted hover:text-primary cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Lịch sử đặt in ({orders.length})
          </h3>
          {orders.length === 0 ? (
            <p className="text-sm text-muted py-2">Chưa có đơn đặt in nào được tạo.</p>
          ) : (
            <div className="divide-y divide-border/70">
              {orders.map((order) => (
                <div
                  key={order.orderCode}
                  className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">
                      <span className="tabular-nums text-primary">{order.orderCode}</span> ·{' '}
                      {order.projectName}
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      {order.quantity} cuốn · {order.customerName} ({order.province})
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-foreground tabular-nums">
                    {formatVnd(order.totalVnd)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};
