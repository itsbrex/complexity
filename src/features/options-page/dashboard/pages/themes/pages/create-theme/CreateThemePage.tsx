import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { AccentColorsSection } from "@/features/options-page/dashboard/pages/themes/pages/create-theme/components/AccentColorsSection";
import { useThemeForm } from "@/features/options-page/dashboard/pages/themes/pages/create-theme/hooks/useThemeForm";

export default function CreateThemePage() {
  const { form, onSubmit } = useThemeForm();

  return (
    <div className="tw-mx-auto tw-max-w-3xl md:tw-mt-8">
      <div className="tw-mb-8">
        <h1 className="tw-mb-2 tw-text-2xl tw-font-bold">
          Create Custom Theme
        </h1>
        <p className="tw-text-muted-foreground">
          Create a custom theme with CSS and predefined options
        </p>
      </div>

      <Card className="tw-p-4">
        <Form {...form}>
          <form className="tw-space-y-6" onSubmit={onSubmit}>
            <div className="tw-space-y-4">
              <FormItem>
                <FormLabel>Font Families</FormLabel>
                <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                  <FormField
                    control={form.control}
                    name="fonts.ui"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="ui (e.g., Inter)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fonts.mono"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
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
                  Enter font families for UI and monospace text
                </FormDescription>
              </FormItem>
            </div>

            <AccentColorsSection form={form} />

            <FormField
              control={form.control}
              name="customCss"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom CSS</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter custom CSS rules"
                      className="tw-font-mono"
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

            <div className="tw-flex tw-justify-end">
              <Button type="submit">Create Theme</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
