import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { roleService } from "../../services/roleService";
import { authService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Pencil, Trash2, PlusCircle, KeyRound } from "lucide-react";
import { extractErrorMessage } from "../../utils/errorutils";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showRoleManagerModal, setShowRoleManagerModal] = useState(false);

  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteUserError, setDeleteUserError] = useState("");

  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteRoleError, setDeleteRoleError] = useState("");

  const [editError, setEditError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [editData, setEditData] = useState({ username: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [newRoleName, setNewRoleName] = useState("");

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  // -------------------------------------------------------
  // LOAD USERS + ROLES (ROBUST)
  // -------------------------------------------------------
  const loadData = async () => {
    try {
      const [u, r] = await Promise.all([
        userService.getAllUsers(),
        roleService.getAllRoles(),
      ]);

      setUsers(Array.isArray(u) ? u : []);
      setRoles(Array.isArray(r) ? r : []);
    } catch (e) {
      console.error("Failed loading data:", e);
      setUsers([]);
      setRoles([]);
    }
  };

  // -------------------------------------------------------
  // EDIT USER
  // -------------------------------------------------------
  const openEditUser = (user) => {
    setSelectedUser(user);
    setEditData({ id: user.id, username: user.username, email: user.email });
    setEditError("");
    setShowEditUserModal(true);
  };

  const saveUser = async () => {
    if (!selectedUser) return;
    setEditError("");

    const dto = {
      id: selectedUser.id,
      username: editData.username,
      email: editData.email,
    };

    try {
      await userService.updateUser(dto);

      const isSelf = selectedUser.username === auth.user;
      const usernameChanged = isSelf && dto.username !== auth.user;

      if (usernameChanged) {
        authService.logout();
        setAuth({});
        navigate("/login");
        return;
      }

      setShowEditUserModal(false);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      setEditError(
        extractErrorMessage(error, "Kunde inte uppdatera användaren.")
      );
    }
  };

  // -------------------------------------------------------
  // CHANGE PASSWORD
  // -------------------------------------------------------
  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordData({ currentPassword: "", newPassword: "" });
    setPasswordError("");
    setShowPasswordModal(true);
  };

  const changePassword = async () => {
    setPasswordError("");

    try {
      await userService.changePassword(selectedUser.username, passwordData);
      setShowPasswordModal(false);
      setSelectedUser(null);
    } catch (error) {
      setPasswordError(
        extractErrorMessage(error, "Lösenordsbyte misslyckades.")
      );
    }
  };

  // -------------------------------------------------------
  // ADD ROLE TO USER
  // -------------------------------------------------------
  const openAddRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole("");
    setShowAddRoleModal(true);
  };

  const addRole = async () => {
    try {
      await userService.addRoleToUser(selectedUser.id, selectedRole);
      setShowAddRoleModal(false);
      loadData();
    } catch (err) {
      alert(extractErrorMessage(err, "Kunde inte lägga till roll."));
    }
  };

  // -------------------------------------------------------
  // REMOVE ROLE (OPTIMISTISK)
  // -------------------------------------------------------
  const handleRemoveRole = async (user, roleName) => {
    const oldUsers = [...users];

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, roles: u.roles.filter((r) => r !== roleName) }
          : u
      )
    );

    try {
      await userService.removeRoleFromUser(user.id, roleName);
    } catch (error) {
      alert(extractErrorMessage(error, "Kunde inte ta bort roll."));
      setUsers(oldUsers);
    }
  };

  // -------------------------------------------------------
  // DELETE USER (OPTIMISTISK + ROLLBACK)
  // -------------------------------------------------------
  const openDeleteUserModal = (user) => {
    setUserToDelete(user);
    setDeleteUserError("");
    setShowDeleteUserModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteUserError("");

    const oldUsers = [...users];
    const deletingSelf = userToDelete.username === auth.user;

    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setShowDeleteUserModal(false);

    try {
      await userService.deleteUser(userToDelete.id);

      if (deletingSelf) {
        authService.logout();
        setAuth({});
        navigate("/login");
      }

      setUserToDelete(null);
      loadData();
    } catch (error) {
      setUsers(oldUsers);
      setDeleteUserError(
        extractErrorMessage(error, "Kunde inte ta bort användaren.")
      );
      setShowDeleteUserModal(true);
    }
  };

  // -------------------------------------------------------
  // ROLE MANAGER (CREATE + DELETE)
  // -------------------------------------------------------
  const createRole = async () => {
    try {
      await roleService.createRole({ name: newRoleName });
      setNewRoleName("");
      loadData();
    } catch (e) {
      alert(extractErrorMessage(e, "Kunde inte skapa roll."));
    }
  };

  const openDeleteRoleModal = (role) => {
    setRoleToDelete(role);
    setDeleteRoleError("");
    setShowDeleteRoleModal(true);
  };

  const confirmDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      await roleService.deleteRole(roleToDelete.id);
      setShowDeleteRoleModal(false);
      setRoleToDelete(null);
      loadData();
    } catch (error) {
      setDeleteRoleError(
        extractErrorMessage(error, "Kunde inte ta bort roll.")
      );
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Användar- och rollhantering
      </h2>

      <button
        className="mb-4 px-4 py-2 bg-[#165C6D] text-white rounded-md"
        onClick={() => setShowRoleManagerModal(true)}
      >
        Hantera roller
      </button>

      {/* USER TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden border">
        <table className="min-w-full text-sm">
          <thead className="bg-[#165C6D] text-white">
            <tr>
              <th className="py-2 px-4 text-left">Användarnamn</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Roller</th>
              <th className="py-2 px-4 text-right">Åtgärder</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(users) &&
              users.map((u, i) => (
                <tr
                  key={u.id}
                  className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2">{u.email}</td>

                  <td className="px-4 py-2">
                    <div className="flex gap-2 flex-wrap">
                      {u.roles?.map((r) => {
                        const isOwnAdmin =
                          r === "ADMIN" && u.username === auth.user;

                        return (
                          <span
                            key={r}
                            className="bg-gray-200 rounded-md px-2 py-1 flex items-center gap-1"
                          >
                            {r}

                            {!isOwnAdmin && (
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveRole(u, r)}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  <td className="px-4 py-2 text-right flex gap-2 justify-end">
                    <button
                      className="text-blue-700 hover:underline"
                      onClick={() => openEditUser(u)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="text-green-700 hover:underline"
                      onClick={() => openPasswordModal(u)}
                    >
                      <KeyRound size={16} />
                    </button>

                    <button
                      className="text-purple-700 hover:underline"
                      onClick={() => openAddRoleModal(u)}
                    >
                      <PlusCircle size={18} />
                    </button>

                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => openDeleteUserModal(u)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ---------------------------------------------------
          MODALS
      --------------------------------------------------- */}

      {/* EDIT USER */}
      {showEditUserModal && (
        <Modal
          title="Redigera användare"
          onClose={() => {
            setShowEditUserModal(false);
            setEditError("");
          }}
        >
          <div className="space-y-4">
            <input
              className="w-full border px-3 py-2 rounded"
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
              placeholder="Användarnamn"
            />

            <input
              className="w-full border px-3 py-2 rounded"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              placeholder="E-post"
            />

            {editError && <div className="text-red-600">{editError}</div>}

            <button
              className="w-full py-2 bg-[#165C6D] text-white rounded-lg"
              onClick={saveUser}
            >
              Spara
            </button>
          </div>
        </Modal>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <Modal
          title="Ändra lösenord"
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordError("");
            setShowCurrentPassword(false);
            setShowNewPassword(false);
          }}
        >
          <div className="space-y-4">
            {/* CURRENT PASSWORD */}
            <div className="relative">
              <input
                className="w-full border px-3 py-2 rounded pr-10"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Nuvarande lösenord"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />

              <button
  type="button"
  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
  onClick={() => setShowCurrentPassword((v) => !v)}
>
  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>

            </div>

            {/* NEW PASSWORD */}
            <div className="relative">
              <input
                className="w-full border px-3 py-2 rounded pr-10"
                type={showNewPassword ? "text" : "password"}
                placeholder="Nytt lösenord"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />

<button
  type="button"
  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
  onClick={() => setShowNewPassword((v) => !v)}
>
  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>

            </div>

            {passwordError && (
              <div className="text-red-600 text-sm">{passwordError}</div>
            )}

            <button
              className="w-full py-2 bg-[#165C6D] text-white rounded-lg"
              onClick={changePassword}
            >
              Uppdatera lösenord
            </button>
          </div>
        </Modal>
      )}

      {/* ADD ROLE */}
      {showAddRoleModal && (
        <Modal
          title="Lägg till roll"
          onClose={() => setShowAddRoleModal(false)}
        >
          <div className="space-y-4">
            <select
              className="w-full border px-3 py-2 rounded"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Välj roll…</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>

            <button
              className="w-full py-2 bg-[#165C6D] text-white rounded-lg"
              onClick={addRole}
            >
              Lägg till roll
            </button>
          </div>
        </Modal>
      )}

      {/* ROLE MANAGER */}
      {showRoleManagerModal && (
        <Modal
          title="Hantera roller"
          onClose={() => setShowRoleManagerModal(false)}
        >
          <div className="space-y-4">
            <ul className="space-y-2">
              {roles.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between items-center border px-3 py-2 rounded"
                >
                  <span>{r.name}</span>
                  <button
                    className="text-red-600"
                    onClick={() => openDeleteRoleModal(r)}
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 mt-3">
              <input
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Ny roll"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
              <button
                className="px-4 bg-[#165C6D] text-white rounded"
                onClick={createRole}
              >
                Skapa
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE USER MODAL */}
      {showDeleteUserModal && userToDelete && (
        <Modal
          title="Ta bort användare"
          onClose={() => {
            setShowDeleteUserModal(false);
            setUserToDelete(null);
            setDeleteUserError("");
          }}
        >
          <p>
            Är du säker på att du vill ta bort{" "}
            <strong>{userToDelete.username}</strong>?
          </p>

          {deleteUserError && (
            <div className="text-red-600 text-sm mt-3">{deleteUserError}</div>
          )}

          <button
            className="w-full mt-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={confirmDeleteUser}
          >
            Ta bort användare
          </button>
        </Modal>
      )}

      {/* DELETE ROLE MODAL */}
      {showDeleteRoleModal && roleToDelete && (
        <Modal
          title="Ta bort roll"
          onClose={() => {
            setShowDeleteRoleModal(false);
            setRoleToDelete(null);
            setDeleteRoleError("");
          }}
        >
          <p>
            Är du säker på att du vill ta bort rollen{" "}
            <strong>{roleToDelete.name}</strong>?
          </p>

          {deleteRoleError && (
            <div className="text-red-600 text-sm mt-3">{deleteRoleError}</div>
          )}

          <button
            className="w-full mt-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={confirmDeleteRole}
          >
            Ta bort roll
          </button>
        </Modal>
      )}
    </div>
  );
}

/* -----------------------------------------------------
   GENERIC MODAL
----------------------------------------------------- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-[#165C6D] mb-4">{title}</h3>

        {children}

        <button
          className="mt-5 w-full py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800"
          onClick={onClose}
        >
          Stäng
        </button>
      </div>
    </div>
  );
}
