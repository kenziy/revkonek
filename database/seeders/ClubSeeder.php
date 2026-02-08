<?php

namespace Database\Seeders;

use App\Enums\ClubEventType;
use App\Enums\ClubRole;
use App\Enums\ClubType;
use App\Enums\JoinRequestStatus;
use App\Enums\PostVisibility;
use App\Enums\RsvpStatus;
use App\Models\Club\Club;
use App\Models\Club\ClubEvent;
use App\Models\Club\ClubMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ClubSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ──

        $president = User::where('email', 'admin@admin.com')->first();
        $rider = User::where('email', 'test@test.com')->first();

        $users = collect();
        for ($i = 1; $i <= 8; $i++) {
            $users->push(User::factory()->create([
                'username' => "rider{$i}",
                'name' => fake()->name(),
            ])->assignRole('user'));
        }

        // ── Club 1: Public club with full MC hierarchy ──

        $club1 = Club::create([
            'owner_id' => $president->id,
            'name' => 'Manila Riders MC',
            'slug' => 'manila-riders-mc',
            'description' => 'The premier motorcycle club of Metro Manila. Weekend rides, track days, and brotherhood.',
            'type' => ClubType::PUBLIC,
            'requires_approval' => false,
            'city' => 'Manila',
            'province' => 'Metro Manila',
            'is_active' => true,
            'is_premium' => true,
        ]);

        // President (owner)
        ClubMember::create([
            'club_id' => $club1->id,
            'user_id' => $president->id,
            'role' => ClubRole::PRESIDENT,
            'joined_at' => now()->subMonths(6),
        ]);

        // Vice President
        ClubMember::create([
            'club_id' => $club1->id,
            'user_id' => $rider->id,
            'role' => ClubRole::VICE_PRESIDENT,
            'joined_at' => now()->subMonths(5),
        ]);

        // Secretary
        ClubMember::create([
            'club_id' => $club1->id,
            'user_id' => $users[0]->id,
            'role' => ClubRole::SECRETARY,
            'joined_at' => now()->subMonths(4),
        ]);

        // Treasurer
        ClubMember::create([
            'club_id' => $club1->id,
            'user_id' => $users[1]->id,
            'role' => ClubRole::TREASURER,
            'joined_at' => now()->subMonths(4),
        ]);

        // Road Captain
        ClubMember::create([
            'club_id' => $club1->id,
            'user_id' => $users[2]->id,
            'role' => ClubRole::ROAD_CAPTAIN,
            'joined_at' => now()->subMonths(3),
        ]);

        // Moderator
        ClubMember::create([
            'club_id' => $club1->id,
            'user_id' => $users[3]->id,
            'role' => ClubRole::MODERATOR,
            'joined_at' => now()->subMonths(2),
        ]);

        // Regular members
        foreach ($users->slice(4, 4) as $user) {
            ClubMember::create([
                'club_id' => $club1->id,
                'user_id' => $user->id,
                'role' => ClubRole::MEMBER,
                'joined_at' => now()->subWeeks(rand(1, 8)),
            ]);
        }

        // Posts
        $club1->posts()->create([
            'user_id' => $president->id,
            'content' => 'Welcome to Manila Riders MC! Respect the patch, respect the road.',
            'is_announcement' => true,
            'is_pinned' => true,
            'visibility' => PostVisibility::PUBLIC,
        ]);

        $club1->posts()->create([
            'user_id' => $rider->id,
            'content' => 'Sunday ride to Tagaytay this weekend. Meet at Shell SLEX at 5AM.',
            'is_announcement' => false,
            'visibility' => PostVisibility::PUBLIC,
        ]);

        $club1->posts()->create([
            'user_id' => $users[2]->id,
            'content' => 'Route briefing for the Batangas ride is now posted. Check events tab.',
            'is_announcement' => false,
            'visibility' => PostVisibility::MEMBERS_ONLY,
        ]);

        // Events
        $ride = $club1->events()->create([
            'created_by' => $users[2]->id,
            'type' => ClubEventType::RIDE,
            'title' => 'Tagaytay Sunday Ride',
            'description' => 'Scenic ride through Aguinaldo Highway. Lunch at Bag of Beans.',
            'location_name' => 'Shell SLEX Southbound',
            'starts_at' => now()->addDays(3)->setHour(5),
            'ends_at' => now()->addDays(3)->setHour(12),
            'route_link' => 'https://maps.app.goo.gl/example',
        ]);

        $ride->rsvps()->create(['user_id' => $president->id, 'status' => RsvpStatus::GOING]);
        $ride->rsvps()->create(['user_id' => $rider->id, 'status' => RsvpStatus::GOING]);
        $ride->rsvps()->create(['user_id' => $users[2]->id, 'status' => RsvpStatus::GOING]);
        $ride->rsvps()->create(['user_id' => $users[4]->id, 'status' => RsvpStatus::MAYBE]);

        $club1->events()->create([
            'created_by' => $president->id,
            'type' => ClubEventType::MEETUP,
            'title' => 'Monthly General Meeting',
            'description' => 'Agenda: upcoming rides, treasury report, new member inductions.',
            'location_name' => 'Dencio\'s BGC',
            'starts_at' => now()->addDays(7)->setHour(19),
            'ends_at' => now()->addDays(7)->setHour(21),
        ]);

        $club1->events()->create([
            'created_by' => $users[2]->id,
            'type' => ClubEventType::TRACK_DAY,
            'title' => 'Clark Track Day',
            'description' => 'Open track session at Clark International Speedway.',
            'location_name' => 'Clark International Speedway',
            'starts_at' => now()->addDays(14)->setHour(7),
            'ends_at' => now()->addDays(14)->setHour(16),
            'max_attendees' => 20,
        ]);

        // ── Club 2: Private club with approval required ──

        $club2 = Club::create([
            'owner_id' => $rider->id,
            'name' => 'Cebu Sportbike Crew',
            'slug' => 'cebu-sportbike-crew',
            'description' => 'Sportbike enthusiasts in Cebu. Track days, twisty roads, and tech talks.',
            'type' => ClubType::PRIVATE,
            'requires_approval' => true,
            'city' => 'Cebu City',
            'province' => 'Cebu',
            'is_active' => true,
        ]);

        ClubMember::create([
            'club_id' => $club2->id,
            'user_id' => $rider->id,
            'role' => ClubRole::PRESIDENT,
            'joined_at' => now()->subMonths(3),
        ]);

        ClubMember::create([
            'club_id' => $club2->id,
            'user_id' => $users[0]->id,
            'role' => ClubRole::VICE_PRESIDENT,
            'joined_at' => now()->subMonths(2),
        ]);

        ClubMember::create([
            'club_id' => $club2->id,
            'user_id' => $users[1]->id,
            'role' => ClubRole::MODERATOR,
            'joined_at' => now()->subMonth(),
        ]);

        ClubMember::create([
            'club_id' => $club2->id,
            'user_id' => $users[5]->id,
            'role' => ClubRole::MEMBER,
            'joined_at' => now()->subWeeks(2),
        ]);

        // Pending join request from admin user
        $club2->joinRequests()->create([
            'user_id' => $president->id,
            'message' => 'I have an R1 and would love to join your crew!',
            'status' => JoinRequestStatus::PENDING,
        ]);

        // Pending join request from another user
        $club2->joinRequests()->create([
            'user_id' => $users[6]->id,
            'message' => 'Sportbike rider from Mandaue. CBR600RR.',
            'status' => JoinRequestStatus::PENDING,
        ]);

        $club2->posts()->create([
            'user_id' => $rider->id,
            'content' => 'Welcome to Cebu Sportbike Crew! Ride safe, ride fast.',
            'is_announcement' => true,
            'is_pinned' => true,
            'visibility' => PostVisibility::PUBLIC,
        ]);

        $club2->events()->create([
            'created_by' => $rider->id,
            'type' => ClubEventType::RIDE,
            'title' => 'Transcentral Highway Night Ride',
            'description' => 'Night ride through the mountains. Full gear required.',
            'location_name' => 'IT Park Cebu',
            'starts_at' => now()->addDays(5)->setHour(20),
            'ends_at' => now()->addDays(5)->setHour(23),
        ]);

        // ── Club 3: Public club with requires_approval ──

        $club3 = Club::create([
            'owner_id' => $users[3]->id,
            'name' => 'Davao Adventure Riders',
            'slug' => 'davao-adventure-riders',
            'description' => 'Off-road and adventure touring in Mindanao. All ADV bikes welcome.',
            'type' => ClubType::PUBLIC,
            'requires_approval' => true,
            'city' => 'Davao City',
            'province' => 'Davao del Sur',
            'is_active' => true,
        ]);

        ClubMember::create([
            'club_id' => $club3->id,
            'user_id' => $users[3]->id,
            'role' => ClubRole::PRESIDENT,
            'joined_at' => now()->subMonths(2),
        ]);

        ClubMember::create([
            'club_id' => $club3->id,
            'user_id' => $users[7]->id,
            'role' => ClubRole::ROAD_CAPTAIN,
            'joined_at' => now()->subMonth(),
        ]);

        // Pending join request (public club with approval)
        $club3->joinRequests()->create([
            'user_id' => $users[4]->id,
            'message' => 'Got a CRF300L Rally, ready for adventures!',
            'status' => JoinRequestStatus::PENDING,
        ]);

        $club3->posts()->create([
            'user_id' => $users[3]->id,
            'content' => 'Planning a Mt. Apo trail ride next month. Who is in?',
            'is_announcement' => false,
            'visibility' => PostVisibility::PUBLIC,
        ]);

        // ── Club 4: Secret club ──

        $club4 = Club::create([
            'owner_id' => $president->id,
            'name' => 'Night Wolves PH',
            'slug' => 'night-wolves-ph',
            'description' => 'Invite-only night riding brotherhood.',
            'type' => ClubType::SECRET,
            'city' => 'Quezon City',
            'province' => 'Metro Manila',
            'is_active' => true,
        ]);

        ClubMember::create([
            'club_id' => $club4->id,
            'user_id' => $president->id,
            'role' => ClubRole::PRESIDENT,
            'joined_at' => now()->subMonths(4),
        ]);

        ClubMember::create([
            'club_id' => $club4->id,
            'user_id' => $users[4]->id,
            'role' => ClubRole::MEMBER,
            'joined_at' => now()->subWeek(),
        ]);

        // ── Club 5: Free tier public club (no approval) ──

        $club5 = Club::create([
            'owner_id' => $users[6]->id,
            'name' => 'Scooter Gang Pampanga',
            'slug' => 'scooter-gang-pampanga',
            'description' => 'Casual scooter meetups around Pampanga. All scooters welcome!',
            'type' => ClubType::PUBLIC,
            'requires_approval' => false,
            'city' => 'San Fernando',
            'province' => 'Pampanga',
            'is_active' => true,
        ]);

        ClubMember::create([
            'club_id' => $club5->id,
            'user_id' => $users[6]->id,
            'role' => ClubRole::PRESIDENT,
            'joined_at' => now()->subWeeks(3),
        ]);

        ClubMember::create([
            'club_id' => $club5->id,
            'user_id' => $users[7]->id,
            'role' => ClubRole::MEMBER,
            'joined_at' => now()->subWeek(),
        ]);

        $club5->posts()->create([
            'user_id' => $users[6]->id,
            'content' => 'First post! Welcome to Scooter Gang Pampanga. Chill rides only.',
            'is_announcement' => true,
            'visibility' => PostVisibility::PUBLIC,
        ]);
    }
}
