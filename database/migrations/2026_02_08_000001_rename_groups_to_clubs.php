<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Rename child tables first (drop FKs, rename columns, re-add FKs)

        // group_join_requests → club_join_requests
        Schema::table('group_join_requests', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
        });
        Schema::rename('group_join_requests', 'club_join_requests');
        Schema::table('club_join_requests', function (Blueprint $table) {
            $table->renameColumn('group_id', 'club_id');
        });
        Schema::table('club_join_requests', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        // group_invites → club_invites
        Schema::table('group_invites', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
        });
        Schema::rename('group_invites', 'club_invites');
        Schema::table('club_invites', function (Blueprint $table) {
            $table->renameColumn('group_id', 'club_id');
        });
        Schema::table('club_invites', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        // group_chat_messages → club_chat_messages
        Schema::table('group_chat_messages', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
        });
        Schema::rename('group_chat_messages', 'club_chat_messages');
        Schema::table('club_chat_messages', function (Blueprint $table) {
            $table->renameColumn('group_id', 'club_id');
        });
        Schema::table('club_chat_messages', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        // group_event_rsvps → club_event_rsvps (has group_event_id FK)
        Schema::table('group_event_rsvps', function (Blueprint $table) {
            $table->dropForeign(['group_event_id']);
        });
        Schema::rename('group_event_rsvps', 'club_event_rsvps');
        Schema::table('club_event_rsvps', function (Blueprint $table) {
            $table->renameColumn('group_event_id', 'club_event_id');
        });
        Schema::table('club_event_rsvps', function (Blueprint $table) {
            $table->foreign('club_event_id')->references('id')->on('group_events')->cascadeOnDelete();
        });

        // group_events → club_events
        Schema::table('group_events', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
        });
        // Drop the temporary FK from club_event_rsvps pointing to group_events before renaming
        Schema::table('club_event_rsvps', function (Blueprint $table) {
            $table->dropForeign(['club_event_id']);
        });
        Schema::rename('group_events', 'club_events');
        Schema::table('club_events', function (Blueprint $table) {
            $table->renameColumn('group_id', 'club_id');
        });
        Schema::table('club_events', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('groups')->cascadeOnDelete();
        });
        // Re-add FK from club_event_rsvps to the now-renamed club_events
        Schema::table('club_event_rsvps', function (Blueprint $table) {
            $table->foreign('club_event_id')->references('id')->on('club_events')->cascadeOnDelete();
        });

        // group_posts → club_posts
        Schema::table('group_posts', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
        });
        Schema::rename('group_posts', 'club_posts');
        Schema::table('club_posts', function (Blueprint $table) {
            $table->renameColumn('group_id', 'club_id');
        });
        Schema::table('club_posts', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        // group_members → club_members
        Schema::table('group_members', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
        });
        Schema::rename('group_members', 'club_members');
        Schema::table('club_members', function (Blueprint $table) {
            $table->renameColumn('group_id', 'club_id');
        });
        Schema::table('club_members', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        // 2. Now drop all temporary FKs pointing to 'groups' and rename the parent table
        Schema::table('club_join_requests', function (Blueprint $table) {
            $table->dropForeign(['club_id']);
        });
        Schema::table('club_invites', function (Blueprint $table) {
            $table->dropForeign(['club_id']);
        });
        Schema::table('club_chat_messages', function (Blueprint $table) {
            $table->dropForeign(['club_id']);
        });
        Schema::table('club_events', function (Blueprint $table) {
            $table->dropForeign(['club_id']);
        });
        Schema::table('club_posts', function (Blueprint $table) {
            $table->dropForeign(['club_id']);
        });
        Schema::table('club_members', function (Blueprint $table) {
            $table->dropForeign(['club_id']);
        });

        // Rename the parent table
        Schema::rename('groups', 'clubs');

        // 3. Re-add all FKs pointing to the renamed 'clubs' table
        Schema::table('club_members', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('clubs')->cascadeOnDelete();
        });
        Schema::table('club_posts', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('clubs')->cascadeOnDelete();
        });
        Schema::table('club_events', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('clubs')->cascadeOnDelete();
        });
        Schema::table('club_chat_messages', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('clubs')->cascadeOnDelete();
        });
        Schema::table('club_invites', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('clubs')->cascadeOnDelete();
        });
        Schema::table('club_join_requests', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('clubs')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        // Drop all FKs from child tables
        $childTables = ['club_members', 'club_posts', 'club_events', 'club_chat_messages', 'club_invites', 'club_join_requests'];
        foreach ($childTables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropForeign(['club_id']);
            });
        }
        Schema::table('club_event_rsvps', function (Blueprint $table) {
            $table->dropForeign(['club_event_id']);
        });

        // Rename parent table back
        Schema::rename('clubs', 'groups');

        // Rename child tables and columns back
        Schema::rename('club_members', 'group_members');
        Schema::table('group_members', function (Blueprint $table) {
            $table->renameColumn('club_id', 'group_id');
        });
        Schema::table('group_members', function (Blueprint $table) {
            $table->foreign('group_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        Schema::rename('club_posts', 'group_posts');
        Schema::table('group_posts', function (Blueprint $table) {
            $table->renameColumn('club_id', 'group_id');
        });
        Schema::table('group_posts', function (Blueprint $table) {
            $table->foreign('group_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        Schema::rename('club_events', 'group_events');
        Schema::table('group_events', function (Blueprint $table) {
            $table->renameColumn('club_id', 'group_id');
        });
        Schema::table('group_events', function (Blueprint $table) {
            $table->foreign('group_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        Schema::rename('club_event_rsvps', 'group_event_rsvps');
        Schema::table('group_event_rsvps', function (Blueprint $table) {
            $table->renameColumn('club_event_id', 'group_event_id');
        });
        Schema::table('group_event_rsvps', function (Blueprint $table) {
            $table->foreign('group_event_id')->references('id')->on('group_events')->cascadeOnDelete();
        });

        Schema::rename('club_chat_messages', 'group_chat_messages');
        Schema::table('group_chat_messages', function (Blueprint $table) {
            $table->renameColumn('club_id', 'group_id');
        });
        Schema::table('group_chat_messages', function (Blueprint $table) {
            $table->foreign('group_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        Schema::rename('club_invites', 'group_invites');
        Schema::table('group_invites', function (Blueprint $table) {
            $table->renameColumn('club_id', 'group_id');
        });
        Schema::table('group_invites', function (Blueprint $table) {
            $table->foreign('group_id')->references('id')->on('groups')->cascadeOnDelete();
        });

        Schema::rename('club_join_requests', 'group_join_requests');
        Schema::table('group_join_requests', function (Blueprint $table) {
            $table->renameColumn('club_id', 'group_id');
        });
        Schema::table('group_join_requests', function (Blueprint $table) {
            $table->foreign('group_id')->references('id')->on('groups')->cascadeOnDelete();
        });
    }
};
