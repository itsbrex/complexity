import { UseFormReturn } from "react-hook-form";
import { LuLoader2 } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ThemeFormValues } from "@/data/dashboard/themes/theme-form.types";
import { ColorInput } from "@/features/options-page/dashboard/pages/themes/components/ColorInput";

type ThemeFormProps = {
  form: UseFormReturn<ThemeFormValues>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  submitText: string;
  footer?: React.ReactNode;
};

export function ThemeForm({
  form,
  onSubmit,
  isPending,
  submitText,
  footer,
}: ThemeFormProps) {
  return (
    <Form {...form}>
      <form className="tw-space-y-6" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          disabled={isPending}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter theme title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Font Families</FormLabel>
          <div className="tw-grid tw-grid-cols-2 tw-gap-4">
            <FormField
              control={form.control}
              disabled={isPending}
              name="fonts.ui"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="tw-font-mono"
                      placeholder="ui (e.g., Inter)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              disabled={isPending}
              name="fonts.mono"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="tw-font-mono"
                      placeholder="monospace (e.g., JetBrains Mono, Fira Code)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormDescription>
            Make sure entered fonts are installed on your system, or import them
            in the CSS section below.
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          disabled={isPending}
          name="accentColor"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ColorInput
                  disabled={field.disabled}
                  value={field.value}
                  label="Primary Color (only affects Dark Mode)"
                  description="Complexity will generate complementary shades based on provided color"
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enhanceThreadTypography"
          disabled={isPending}
          render={({ field }) => (
            <FormItem className="tw-flex tw-flex-row tw-items-center tw-justify-between">
              <div className="tw-space-y-0.5">
                <FormLabel>Enhance Typography (in Threads)</FormLabel>
                <FormDescription>
                  Emphasizes headings, bold text, make inline code more
                  readable, and remove font ligatures.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  disabled={field.disabled}
                  checked={field.value}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          disabled={isPending}
          name="customCss"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Advanced: CSS</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter custom CSS rules"
                  className="tw-min-h-[300px] tw-font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add custom CSS rules to further customize your theme
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="tw-flex tw-justify-end tw-gap-2">
          {footer}
          <Button type="submit" disabled={isPending || !form.formState.isDirty}>
            {isPending ? (
              <LuLoader2 className="tw-size-4 tw-animate-spin" />
            ) : (
              submitText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
