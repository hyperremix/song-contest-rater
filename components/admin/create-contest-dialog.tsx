'use client';

import { translations } from '@/i18n';
import { CreateCompetitionRequest } from '@/protos/competition';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Typography } from '../custom/typography';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (createContestRequest: CreateCompetitionRequest) => void;
};

const formSchema = z.object({
  heat: z.number(),
  city: z.string().min(1),
  country: z.string().min(1),
  startDate: z.date(),
  imageUrl: z.string().url().min(1),
});

export const CreateContestDialog = ({
  isOpen,
  onOpenChange,
  onSave,
}: Props) => {
  const t = useTranslations();
  const formatter = useFormatter();

  const contestHeatData = Object.entries(translations.contest.heat)
    .filter(([key]) => key !== '0' && key !== '-1')
    .map(([key, value]) => ({
      label: t(value),
      value: key,
    }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heat: 1,
      city: '',
      country: '',
      startDate: new Date(),
      imageUrl: '',
    },
  });

  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      if (date) {
        const currentDate = form.getValues('startDate');
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        date.setHours(currentHours, currentMinutes, 0, 0);
        form.setValue('startDate', date);
      }
    },
    [form],
  );

  const handleTimeChange = useCallback(
    (type: 'hour' | 'minute', value: number) => {
      const date = new Date(form.getValues('startDate'));
      if (type === 'hour') {
        date.setHours(value);
      } else {
        date.setMinutes(value);
      }
      form.setValue('startDate', date);
    },
    [form],
  );

  const handleSave = (values: z.infer<typeof formSchema>) => {
    const seconds = Math.floor(values.startDate.getTime() / 1000);
    const nanos = (values.startDate.getTime() % 1000) * 1000000;

    onSave({
      heat: values.heat,
      city: values.city,
      country: values.country,
      start_time: {
        seconds,
        nanos,
      },
      image_url: values.imageUrl,
    });

    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(translations.contest.addContestModalTitle)}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="heat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heat</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={`${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select heat type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contestHeatData.map((heat) => (
                        <SelectItem key={heat.value} value={heat.value}>
                          {heat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="input"
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            formatter.dateTime(field.value, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              weekday: 'short',
                            })
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 sm:flex"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                      <div className="flex flex-col divide-y divide-zinc-200 sm:h-[350px] sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-zinc-800">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex p-2 sm:flex-col">
                            {Array.from({ length: 24 }, (_, i) => i).map(
                              (hour) => (
                                <Button
                                  key={hour}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    field.value.getHours() === hour
                                      ? 'default'
                                      : 'ghost'
                                  }
                                  className="aspect-square shrink-0 sm:w-full"
                                  onClick={() => handleTimeChange('hour', hour)}
                                >
                                  {hour.toString().padStart(2, '0')}
                                </Button>
                              ),
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex p-2 sm:flex-col">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    field.value.getMinutes() === minute
                                      ? 'default'
                                      : 'ghost'
                                  }
                                  className="aspect-square shrink-0 sm:w-full"
                                  onClick={() =>
                                    handleTimeChange('minute', minute)
                                  }
                                >
                                  {minute.toString().padStart(2, '0')}
                                </Button>
                              ),
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL" {...field} />
                  </FormControl>
                  {field.value && (
                    <div className="mt-2">
                      <Typography className="mb-1">Preview:</Typography>
                      <div className="h-32 w-32 overflow-hidden rounded-md">
                        {field.value && (
                          <Image
                            src={toImagekitUrl(field.value, [
                              { height: '256', width: '256', focus: 'auto' },
                            ])}
                            width={128}
                            height={128}
                            alt=""
                            blurDataURL={toImagekitUrl(field.value, [
                              { height: '1', width: '1', focus: 'auto' },
                            ])}
                            placeholder="blur"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                className="flex-1"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t(translations.buttonLabelCancel)}
              </Button>
              <Button className="flex-1" type="submit">
                Create Contest
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
