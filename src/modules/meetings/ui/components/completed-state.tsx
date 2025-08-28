import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingGetOne } from "../../types";
import {
  BookOpenTextIcon,
  SparklesIcon,
  FileTextIcon,
  FileVideoIcon,
  ClockFadingIcon,
  SpaceIcon,
} from "lucide-react";
import Markdown from "react-markdown";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";

interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-white rounded-lg border-px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              <TabsTrigger
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                value="summary"
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                value="transcript"
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                value="recording"
              >
                <FileVideoIcon />
                Recording
              </TabsTrigger>
              <TabsTrigger
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                value="chat"
              >
                <SparklesIcon />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <TabsContent value="recording">
          <div className="bg-white rounded-lg border px-4 py-5">
            <video
              src={data.recordingUrl!}
              controls
              className="w-full rounded-lg"
            />
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              <div className="flex gap-x-2 items-center">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                >
                  <GeneratedAvatar
                    seed={data.agent.name}
                    variant="botttsNeutral"
                    className="size-5"
                  />
                  {data.agent.name}
                </Link>{" "}
                <p>
                  {data.startedAt ? format(data.startedAt, "PPP") : ""}
                </p>
              </div>
              <div className="flex gap-x-2 items-center">
                <SparklesIcon className="size-4" />
                <p>AI summary </p>
              </div>
              <Badge
                variant="outline"
                className="flex items-center gap-x-2 [&>svg]:size-4"
              >
                <ClockFadingIcon className="text-blue-700" />
                {data.duration ? formatDuration(data.duration) : "No duration"}
              </Badge>
              <div>
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 className="text-2xl font-medium mb-6" {...props} />
                    ),
                    h2: (props) => (
                      <h2 className="text-xl font-medium mb-6" {...props} />
                    ),
                    h3: (props) => (
                      <h3 className="text-lg font-medium mb-6" {...props} />
                    ),
                    h4: (props) => (
                      <h4 className="text-base font-medium mb-6" {...props} />
                    ),
                    p: (props) => (
                      <p className="leading-relaxed mb-6" {...props} />
                    ),
                    ul: (props) => (
                      <ul className="list-disc pl-6 mb-6" {...props} />
                    ),
                    ol: (props) => (
                      <ol className="list-decimal pl-6 mb-6" {...props} />
                    ),
                    li: (props) => <li className="mb-2" {...props} />,
                    strong: (props) => (
                      <strong className="font-bold" {...props} />
                    ),
                    code: (props) => (
                      <code className="bg-gray-100 rounded-md p-1" {...props} />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-4 border-gray-300 pl-4 mb-6"
                        {...props}
                      />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
