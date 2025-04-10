'use client';

import { translations } from '@/i18n';
import { cn } from '@/lib/utils';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import {
  Contest,
  UpdateContestRequest,
  UpdateContestRequestSchema,
} from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/contest_pb';
import { create } from '@bufbuild/protobuf';
import { TimestampSchema } from '@bufbuild/protobuf/wkt';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
type Props = {
  contest: Contest | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (updateContestRequest: UpdateContestRequest) => void;
};

const formSchema = z.object({
  heat: z.number(),
  city: z.string().min(1),
  country: z.string().min(1),
  startDate: z.date(),
  imageUrl: z.string().url().min(1),
});

export const UpdateContestDialog = ({
  contest,
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
      heat: contest?.heat ?? 0,
      city: contest?.city ?? '',
      country: contest?.country ?? '',
      startDate: contest?.startTime
        ? new Date(
            Number(contest.startTime.seconds) * 1000 +
              (contest.startTime.nanos || 0) / 1000000,
          )
        : new Date(),
      imageUrl: contest?.imageUrl ?? '',
    },
  });

  useEffect(() => {
    if (contest) {
      const startDate = contest.startTime
        ? new Date(
            Number(contest.startTime.seconds) * 1000 +
              (contest.startTime.nanos || 0) / 1000000,
          )
        : new Date();

      form.reset({
        heat: contest.heat,
        city: contest.city,
        country: contest.country,
        startDate,
        imageUrl: contest.imageUrl,
      });
    }
  }, [contest, form]);

  const handleSave = (values: z.infer<typeof formSchema>) => {
    if (contest) {
      const seconds = Math.floor(values.startDate.getTime() / 1000);
      const nanos = (values.startDate.getTime() % 1000) * 1000000;

      onSave(
        create(UpdateContestRequestSchema, {
          id: contest.id,
          heat: values.heat,
          city: values.city,
          country: values.country,
          startTime: create(TimestampSchema, {
            seconds: BigInt(seconds),
            nanos,
          }),
          imageUrl: values.imageUrl,
        }),
      );

      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(translations.contest.editContestModalTitle)}
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
                    value={String(field.value)}
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
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
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
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
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

            <DialogFooter className="mt-5">
              <Button
                type="button"
                className="flex-1"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t(translations.buttonLabelCancel)}
              </Button>
              <Button className="flex-1" type="submit">
                Update Contest
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
