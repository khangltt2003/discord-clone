import { ConversationHeader } from "@/components/conversation/conversation-header";
import { ChannelInput } from "@/components/conversation/conversation-input";
import ProfileCard from "@/components/conversation/conversation-member-card";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { redirect } from "next/navigation";
import React from "react";

const ConversationPage = async (props: { params: Promise<{ conversationId: string }> }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const params = await props.params;

  const conversationId = params.conversationId;

  if (!conversationId) {
    return redirect("/");
  }

  const conversation = await db.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      memberOne: true,
      memberTwo: true,
    },
  });

  if (!conversation) {
    return redirect("/");
  }

  const memberTwo = conversation.memberOneId === profile.id ? conversation.memberTwo : conversation.memberOne;

  return (
    <div className="bg-white dark:bg-[#00000014] h-full flex flex-col ">
      <div>
        <ConversationHeader memberTwo={memberTwo} />
      </div>
      <div className="flex w-full h-full">
        <div className="flex flex-col w-full p-4 ">
          <ScrollArea className="flex-1">future message</ScrollArea>
          {/* <ChannelInput name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{ channelId: channel.id, serverId: server.id }} /> */}
        </div>

        <div className="hidden md:flex flex-col w-96 z-20 bg-[#00000045]  ">
          <ProfileCard memberTwo={memberTwo} />
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
