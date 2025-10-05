import {
  ArrowUpRightIcon,
  BotIcon,
  DockIcon,
  GraduationCapIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto flex flex-col py-6 lg:py-8 space-y-4">
      <div className="text-center p-6 space-y-2">
        <h1 className="text-4xl font-semibold tracking-wider flex flex-col items-center justify-center">
          <GraduationCapIcon className="size-12" /> Ask Jury
        </h1>
        <p className="">Your leagal assistant</p>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <Card
          Icon={DockIcon}
          title="Review your offer letter"
          description="Analyze job offer or employment policy documents from Ask Jury."
          href="/review-offer-letter"
        />
        <Card
          Icon={BotIcon}
          title="Review a document"
          description="Find any hidden policy that may lead to exploitation."
        />
        <Card
          Icon={BotIcon}
          title="Review a document"
          description="Find any hidden policy that may lead to exploitation."
        />
        <Card
          Icon={BotIcon}
          title="Review a document"
          description="Find any hidden policy that may lead to exploitation."
        />
        <Card
          Icon={BotIcon}
          title="Review a document"
          description="Find any hidden policy that may lead to exploitation."
        />
        <Card
          Icon={BotIcon}
          title="Review a document"
          description="Find any hidden policy that may lead to exploitation."
        />
      </div>

      <div className="p-4 flex items-center justify-center">
        <Link
          href="/chat"
          className="px-6 py-3 bg-primary text-primary-foreground flex items-center justify-center gap-2 border hover:bg-primary/95 rounded-full"
        >
          <span>Chat</span>
          <ArrowUpRightIcon className="size-5" />
        </Link>
      </div>
    </div>
  );
};

const Card: React.FC<{
  Icon: React.FC<{ className: string }>;
  title: string;
  description: string;
  href?: string;
}> = ({ Icon, title, description, href = "/" }) => {
  return (
    <Link
      href={href}
      className="p-3 max-w-96 sm:max-w-none mx-auto flex items-start gap-3 rounded-lg bg-card text-card-foreground border shadow-md"
    >
      <div className="bg-muted p-3 rounded-full">
        {<Icon className="size-7" />}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
};

export default Home;
