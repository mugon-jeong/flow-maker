import React from 'react';
import {useModal} from '@/providers/modal-provider';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Loader2} from 'lucide-react';
import {
  createWorkflow,
  updateWorkflow,
} from '@/app/(main)/(pages)/workflows/_actions/workflow-action';
import {useToast} from '@/hooks/use-toast';

type Props = {
  id?: string;
  title?: string;
  subTitle?: string;
  defaultValues?: {
    title: string;
    description?: string | null;
  };
};

const formSchema = z.object({
  title: z.string().min(1, {message: 'Title is required'}),
  description: z.string(),
});
const WorkflowForm = ({id, title, subTitle, defaultValues}: Props) => {
  const {setClose} = useModal();
  const {toast} = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
    },
  });
  const isLoading = form.formState.isLoading;
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const result =
      id == undefined
        ? await createWorkflow({
            title: values.title,
            description: values.description,
          })
        : await updateWorkflow(id, {
            title: values.title,
            description: values.description,
          });

    if (result) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create workflow',
      });
      return;
    }
    router.refresh();
    setClose();
  };

  return (
    <Card className="w-full max-w-[650px] border-none">
      {title ||
        (subTitle && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subTitle}</CardDescription>
          </CardHeader>
        ))}
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 text-left"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default WorkflowForm;
