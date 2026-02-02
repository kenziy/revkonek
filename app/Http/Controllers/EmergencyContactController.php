<?php

namespace App\Http\Controllers;

use App\Models\Sos\EmergencyContact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmergencyContactController extends Controller
{
    public function index(): Response
    {
        $contacts = EmergencyContact::where('user_id', Auth::id())
            ->orderBy('priority')
            ->get();

        return Inertia::render('SOS/Contacts', [
            'contacts' => $contacts,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'relationship' => ['nullable', 'string', 'max:50'],
            'notify_on_sos' => ['boolean'],
        ]);

        // Get highest priority and add 1
        $maxPriority = EmergencyContact::where('user_id', Auth::id())->max('priority') ?? 0;

        EmergencyContact::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'relationship' => $validated['relationship'] ?? null,
            'notify_on_sos' => $validated['notify_on_sos'] ?? true,
            'priority' => $maxPriority + 1,
        ]);

        return redirect()->route('sos.contacts')
            ->with('success', 'Emergency contact added successfully!');
    }

    public function update(Request $request, EmergencyContact $contact): RedirectResponse
    {
        // Ensure user owns this contact
        if ($contact->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'relationship' => ['nullable', 'string', 'max:50'],
            'notify_on_sos' => ['boolean'],
        ]);

        $contact->update($validated);

        return redirect()->route('sos.contacts')
            ->with('success', 'Emergency contact updated successfully!');
    }

    public function destroy(EmergencyContact $contact): RedirectResponse
    {
        // Ensure user owns this contact
        if ($contact->user_id !== Auth::id()) {
            abort(403);
        }

        $contact->delete();

        return redirect()->route('sos.contacts')
            ->with('success', 'Emergency contact removed.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'contacts' => ['required', 'array'],
            'contacts.*.id' => ['required', 'integer', 'exists:emergency_contacts,id'],
            'contacts.*.priority' => ['required', 'integer', 'min:1'],
        ]);

        foreach ($validated['contacts'] as $item) {
            EmergencyContact::where('id', $item['id'])
                ->where('user_id', Auth::id())
                ->update(['priority' => $item['priority']]);
        }

        return redirect()->route('sos.contacts')
            ->with('success', 'Contact order updated.');
    }
}
