'use client';

import { translations } from '@/i18n';
import { CreateActRequest } from '@/protos/act';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Typography } from '../custom/typography';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (createActRequest: CreateActRequest) => void;
};

const formSchema = z.object({
  artistName: z.string().min(1),
  songName: z.string().min(1),
  imageUrl: z.string().url().min(1),
});

export const CreateActDialog = ({ isOpen, onOpenChange, onSave }: Props) => {
  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistName: '',
      songName: '',
      imageUrl: '',
    },
  });

  const handleSave = (values: z.infer<typeof formSchema>) => {
    onSave({
      artist_name: values.artistName,
      song_name: values.songName,
      image_url: values.imageUrl,
    });

    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(translations.act.addActModalTitle)}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="artistName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter artist name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="songName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Song Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter song name" {...field} />
                  </FormControl>
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
                Create Act
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
