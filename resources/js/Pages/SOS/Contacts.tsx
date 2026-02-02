import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, Badge, EmptyState } from '@/Components/UI';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Switch from '@/Components/Form/Switch';
import Modal from '@/Components/Modal';
import { useState, FormEventHandler } from 'react';
import clsx from 'clsx';
import {
    PlusIcon,
    UserCircleIcon,
    PhoneIcon,
    PencilIcon,
    TrashIcon,
    BellIcon,
    BellSlashIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';

interface Contact {
    id: number;
    name: string;
    phone: string;
    relationship?: string;
    notify_on_sos: boolean;
    priority: number;
}

interface ContactsProps {
    contacts: Contact[];
}

const relationshipOptions = [
    'Spouse',
    'Parent',
    'Sibling',
    'Child',
    'Friend',
    'Partner',
    'Other',
];

export default function Contacts({ contacts }: ContactsProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

    // Add form
    const addForm = useForm({
        name: '',
        phone: '',
        relationship: '',
        notify_on_sos: true,
    });

    // Edit form
    const editForm = useForm({
        name: '',
        phone: '',
        relationship: '',
        notify_on_sos: true,
    });

    const handleAdd: FormEventHandler = (e) => {
        e.preventDefault();
        addForm.post(route('sos.contacts.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                addForm.reset();
            },
        });
    };

    const openEditModal = (contact: Contact) => {
        setEditingContact(contact);
        editForm.setData({
            name: contact.name,
            phone: contact.phone,
            relationship: contact.relationship || '',
            notify_on_sos: contact.notify_on_sos,
        });
    };

    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingContact) return;

        editForm.put(route('sos.contacts.update', editingContact.id), {
            onSuccess: () => {
                setEditingContact(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingContact) return;

        router.delete(route('sos.contacts.destroy', deletingContact.id), {
            onSuccess: () => {
                setDeletingContact(null);
            },
        });
    };

    return (
        <AuthenticatedLayout header="Emergency Contacts">
            <Head title="Emergency Contacts" />

            <div className="space-y-6">
                {/* Info Card */}
                <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                    <div className="flex gap-3">
                        <HeartIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        <div>
                            <h3 className="font-medium text-primary-900 dark:text-primary-100">
                                Why add emergency contacts?
                            </h3>
                            <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
                                In case of an emergency, these people will be notified with your location.
                                Add trusted family members or friends who can help in an emergency.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Contacts List */}
                {contacts.length > 0 ? (
                    <div className="space-y-3">
                        {contacts.map((contact, index) => (
                            <Card key={contact.id} className="relative">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center flex-shrink-0">
                                        <UserCircleIcon className="h-7 w-7 text-secondary-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-secondary-900 dark:text-white">
                                                {contact.name}
                                            </h3>
                                            {index === 0 && (
                                                <Badge variant="primary" size="sm">
                                                    Primary
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                                            <PhoneIcon className="h-4 w-4" />
                                            {contact.phone}
                                        </div>
                                        {contact.relationship && (
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                                                {contact.relationship}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-1 mt-2">
                                            {contact.notify_on_sos ? (
                                                <Badge variant="success" size="sm">
                                                    <BellIcon className="h-3 w-3 mr-1" />
                                                    Will be notified
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" size="sm">
                                                    <BellSlashIcon className="h-3 w-3 mr-1" />
                                                    Won't be notified
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(contact)}
                                            className="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setDeletingContact(contact)}
                                            className="p-2 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <EmptyState
                            icon={<UserCircleIcon className="h-8 w-8" />}
                            title="No emergency contacts"
                            description="Add someone who can be notified in case of an emergency"
                            action={{
                                label: 'Add Contact',
                                onClick: () => setShowAddModal(true),
                            }}
                        />
                    </Card>
                )}

                {/* Add Button */}
                {contacts.length > 0 && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={clsx(
                            'w-full flex items-center justify-center gap-2 p-4 rounded-xl',
                            'border-2 border-dashed border-secondary-300 dark:border-secondary-600',
                            'text-secondary-600 dark:text-secondary-400',
                            'hover:border-primary-400 hover:text-primary-600',
                            'dark:hover:border-primary-500 dark:hover:text-primary-400',
                            'transition-colors'
                        )}
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Another Contact
                    </button>
                )}
            </div>

            {/* Add Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <form onSubmit={handleAdd} className="p-6">
                    <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                        Add Emergency Contact
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="add-name" value="Name" />
                            <TextInput
                                id="add-name"
                                value={addForm.data.name}
                                onChange={(e) => addForm.setData('name', e.target.value)}
                                placeholder="Contact's full name"
                                className="mt-1"
                                required
                            />
                            <InputError message={addForm.errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="add-phone" value="Phone Number" />
                            <TextInput
                                id="add-phone"
                                type="tel"
                                value={addForm.data.phone}
                                onChange={(e) => addForm.setData('phone', e.target.value)}
                                placeholder="e.g., 09123456789"
                                className="mt-1"
                                required
                            />
                            <InputError message={addForm.errors.phone} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="add-relationship" value="Relationship (Optional)" />
                            <select
                                id="add-relationship"
                                value={addForm.data.relationship}
                                onChange={(e) => addForm.setData('relationship', e.target.value)}
                                className={clsx(
                                    'w-full rounded-lg border px-4 py-3 text-sm mt-1',
                                    'border-secondary-300 bg-white text-secondary-900',
                                    'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
                                    'dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100'
                                )}
                            >
                                <option value="">Select relationship</option>
                                {relationshipOptions.map((rel) => (
                                    <option key={rel} value={rel}>
                                        {rel}
                                    </option>
                                ))}
                            </select>
                            <InputError message={addForm.errors.relationship} className="mt-2" />
                        </div>

                        <div className="pt-2">
                            <Switch
                                checked={addForm.data.notify_on_sos}
                                onChange={(checked) => addForm.setData('notify_on_sos', checked)}
                                label="Notify on SOS"
                                description="Send SMS alert when SOS is triggered"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton type="button" onClick={() => setShowAddModal(false)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={addForm.processing}>
                            {addForm.processing ? 'Adding...' : 'Add Contact'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={!!editingContact} onClose={() => setEditingContact(null)}>
                <form onSubmit={handleEdit} className="p-6">
                    <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                        Edit Emergency Contact
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="edit-name" value="Name" />
                            <TextInput
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                placeholder="Contact's full name"
                                className="mt-1"
                                required
                            />
                            <InputError message={editForm.errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="edit-phone" value="Phone Number" />
                            <TextInput
                                id="edit-phone"
                                type="tel"
                                value={editForm.data.phone}
                                onChange={(e) => editForm.setData('phone', e.target.value)}
                                placeholder="e.g., 09123456789"
                                className="mt-1"
                                required
                            />
                            <InputError message={editForm.errors.phone} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="edit-relationship" value="Relationship (Optional)" />
                            <select
                                id="edit-relationship"
                                value={editForm.data.relationship}
                                onChange={(e) => editForm.setData('relationship', e.target.value)}
                                className={clsx(
                                    'w-full rounded-lg border px-4 py-3 text-sm mt-1',
                                    'border-secondary-300 bg-white text-secondary-900',
                                    'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
                                    'dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100'
                                )}
                            >
                                <option value="">Select relationship</option>
                                {relationshipOptions.map((rel) => (
                                    <option key={rel} value={rel}>
                                        {rel}
                                    </option>
                                ))}
                            </select>
                            <InputError message={editForm.errors.relationship} className="mt-2" />
                        </div>

                        <div className="pt-2">
                            <Switch
                                checked={editForm.data.notify_on_sos}
                                onChange={(checked) => editForm.setData('notify_on_sos', checked)}
                                label="Notify on SOS"
                                description="Send SMS alert when SOS is triggered"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton type="button" onClick={() => setEditingContact(null)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={editForm.processing}>
                            {editForm.processing ? 'Saving...' : 'Save Changes'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={!!deletingContact} onClose={() => setDeletingContact(null)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                        Remove Emergency Contact?
                    </h2>
                    <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                        Are you sure you want to remove{' '}
                        <span className="font-medium text-secondary-900 dark:text-white">
                            {deletingContact?.name}
                        </span>{' '}
                        from your emergency contacts? They will no longer be notified in case of an emergency.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton onClick={() => setDeletingContact(null)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete}>
                            Remove Contact
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
