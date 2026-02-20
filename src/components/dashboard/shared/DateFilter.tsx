import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export type DateFilterValue = 'today' | 'yesterday' | 'week' | 'month' | 'all' | 'custom';

interface DateFilterProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
  showLabel?: boolean;
  compact?: boolean;
  // Custom range support
  customRange?: { start: Date; end: Date } | null;
  onCustomRangeChange?: (range: { start: Date; end: Date } | null) => void;
  showCustomRange?: boolean;
}

export function DateFilter({ 
  value, 
  onChange, 
  showLabel = true, 
  compact = false,
  customRange,
  onCustomRangeChange,
  showCustomRange = false
}: DateFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    customRange ? { from: customRange.start, to: customRange.end } : undefined
  );
  const [popoverOpen, setPopoverOpen] = useState(false);

  const options = [
    { value: 'today' as const, label: 'Hoy', icon: Clock },
    { value: 'yesterday' as const, label: 'Ayer', icon: CalendarIcon },
    { value: 'week' as const, label: 'Últimos 7 días', icon: CalendarIcon },
    { value: 'month' as const, label: 'Últimos 30 días', icon: CalendarIcon },
    { value: 'all' as const, label: 'Todos', icon: CalendarIcon },
  ];

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to && onCustomRangeChange) {
      onCustomRangeChange({ start: range.from, end: range.to });
      onChange('custom');
      setPopoverOpen(false);
    }
  };

  const customRangeLabel = customRange 
    ? `${format(customRange.start, 'd MMM', { locale: es })} - ${format(customRange.end, 'd MMM', { locale: es })}`
    : 'Rango';

  if (compact) {
    return (
      <div className="flex gap-2">
        <Select value={value === 'custom' ? 'all' : value} onValueChange={onChange}>
          <SelectTrigger className="w-[150px] bg-background">
            <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showCustomRange && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant={value === 'custom' ? 'default' : 'outline'} 
                size="sm"
                className="bg-background"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                {value === 'custom' ? customRangeLabel : 'Rango'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleRangeSelect}
                numberOfMonths={2}
                locale={es}
                disabled={(date) => date > new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showLabel && (
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          Período:
        </span>
      )}
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <Button
            key={opt.value}
            variant={value === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(opt.value)}
            className={value === opt.value ? '' : 'bg-background hover:bg-accent'}
          >
            {opt.label}
          </Button>
        ))}
        {showCustomRange && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant={value === 'custom' ? 'default' : 'outline'} 
                size="sm"
                className={value === 'custom' ? '' : 'bg-background hover:bg-accent'}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                {value === 'custom' ? customRangeLabel : 'Rango'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleRangeSelect}
                numberOfMonths={2}
                locale={es}
                disabled={(date) => date > new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}

// Utility function to filter orders by date
// Uses rolling periods: "week" = last 7 days, "month" = last 30 days
export function getDateRange(
  filter: DateFilterValue, 
  customRange?: { start: Date; end: Date } | null
): { start: Date | null; end: Date | null } {
  const now = new Date();
  
  switch (filter) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'yesterday':
      const yesterday = subDays(now, 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    case 'week':
      // Last 7 days (rolling), not calendar week
      return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
    case 'month':
      // Last 30 days (rolling), not calendar month
      return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
    case 'custom':
      if (customRange) {
        return { start: startOfDay(customRange.start), end: endOfDay(customRange.end) };
      }
      return { start: null, end: null };
    case 'all':
    default:
      return { start: null, end: null };
  }
}

// Hook to filter orders by date
export function filterOrdersByDate<T extends { created_at: string; delivered_at?: string | null; validated_at?: string | null }>(
  orders: T[],
  filter: DateFilterValue,
  dateField: keyof T = 'created_at' as keyof T,
  customRange?: { start: Date; end: Date } | null
): T[] {
  const { start, end } = getDateRange(filter, customRange);
  
  if (!start || !end) return orders;
  
  return orders.filter(order => {
    const dateValue = order[dateField];
    if (!dateValue) return false;
    const orderDate = new Date(dateValue as string);
    return orderDate >= start && orderDate <= end;
  });
}

// Format the date filter description
export function getDateFilterDescription(
  filter: DateFilterValue,
  customRange?: { start: Date; end: Date } | null
): string {
  switch (filter) {
    case 'today':
      return format(new Date(), "'Hoy,' d 'de' MMMM", { locale: es });
    case 'yesterday':
      return format(subDays(new Date(), 1), "'Ayer,' d 'de' MMMM", { locale: es });
    case 'week':
      return 'Últimos 7 días';
    case 'month':
      return 'Últimos 30 días';
    case 'custom':
      if (customRange) {
        return `${format(customRange.start, "d 'de' MMMM", { locale: es })} - ${format(customRange.end, "d 'de' MMMM", { locale: es })}`;
      }
      return 'Rango personalizado';
    case 'all':
    default:
      return 'Todos los pedidos';
  }
}
