import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { roleService } from "../../services/roleService";
import { authService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, PlusCircle, KeyRound } from "lucide-react";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showRoleManagerModal, setShowRoleManagerModal] = useState(false);

  // Nytt: modaler + error state för delete user / delete role
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteUserError, setDeleteUserError] = useState("");

  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteRoleError, setDeleteRoleError] = useState("");

  // Error i andra modaler
  const [editError, setEditError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const loadData = async () => {
    const users = await userService.getAllUsers();
    const roles = await roleService.getAllRoles();
    setUsers(users);
    setRoles(roles);
  };

  // -----------------------------
  // UPDATE USER
  // -----------------------------
  const openEditUser = (user) => {
    setSelectedUser(user);
    setEditData({ id: user.id, username: user.username, email: user.email });
    setEditError("");
    setShowEditUserModal(true);
  };

  const saveUser = async () => {
    if (!selectedUser) return;

    const dto = {
      id: selectedUser.id,
      username: editData.username,
      email: editData.email,
    };

    setEditError("");

    try {
      await userService.updateUser(dto);

      // Auto-logout om du ändrar ditt eget användarnamn
      const isSelf = selectedUser.username === auth.user;
      const usernameChanged = isSelf && dto.username !== auth.user;

      if (isSelf && usernameChanged) {
        authService.logout();
        setAuth({});
        navigate("/login");
        return;
      }

      setShowEditUserModal(false);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Kunde inte uppdatera användaren.";
      setEditError(msg);
    }
  };

  // -----------------------------
  // CHANGE PASSWORD
  // -----------------------------
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
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Lösenordsbyte misslyckades.";
      setPasswordError(msg);
    }
  };

  // -----------------------------
  // ADD ROLE TO USER
  // -----------------------------
  const openAddRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole("");
    setShowAddRoleModal(true);
  };

  const addRole = async () => {
    await userService.addRoleToUser(selectedUser.id, selectedRole);
    setShowAddRoleModal(false);
    loadData();
  };

  // -----------------------------
  // OPTIMISTIC REMOVE ROLE FROM USER
  // -----------------------------
  const handleRemoveRole = async (user, roleName) => {
    const oldUsers = [...users];

    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? { ...u, roles: u.roles.filter((r) => r !== roleName) }
        : u
    );
    setUsers(updatedUsers);

    try {
      await userService.removeRoleFromUser(user.id, roleName);
    } catch (error) {
      alert(error.response?.data || "Kunde inte ta bort roll");
      setUsers(oldUsers); // rollback
    }
  };

  // -----------------------------
  // DELETE USER (via modal)
  // -----------------------------
  const openDeleteUserModal = (user) => {
    setUserToDelete(user);
    setDeleteUserError("");
    setShowDeleteUserModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete.id);

      const deletingSelf = userToDelete.username === auth.user;

      if (deletingSelf) {
        authService.logout();
        setAuth({});
        navigate("/login");
        return;
      }

      setShowDeleteUserModal(false);
      setUserToDelete(null);
      setDeleteUserError("");
      loadData();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Kunde inte ta bort användaren.";
      setDeleteUserError(msg);
    }
  };

  // -----------------------------
  // ROLE MANAGER (CREATE + DELETE)
  // -----------------------------

  const extractErrorMessage = (err) => {
    if (!err) return "Ett okänt fel inträffade.";

    if (typeof err === "string") return err;
    if (err.message) return err.message;
    if (err.errors) return err.errors;

    try {
      return JSON.stringify(err);
    } catch {
      return "Ett okänt fel inträffade.";
    }
  };

  const createRole = async () => {
    await roleService.createRole({ name: newRoleName });
    setNewRoleName("");
    loadData();
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
      setDeleteRoleError("");
      loadData();
    } catch (error) {
      const msg = extractErrorMessage(error?.response?.data || error);
      setDeleteRoleError(msg);
    }
  };

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

      {/* ---------------------------------------------------
         USER LIST
      --------------------------------------------------- */}
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
            {users.map((u, i) => (
              <tr
                key={u.id}
                className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 flex-wrap">
                    {u.roles?.map((r) => {
                      // Hindra att man tar bort sin egen ADMIN-roll
                      const isOwnAdminRole =
                        r === "ADMIN" && u.username === auth.user;

                      return (
                        <span
                          key={r}
                          className="bg-gray-200 rounded-md px-2 py-1 flex items-center gap-1"
                        >
                          {r}

                          {!isOwnAdminRole && (
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

      {/* EDIT USER MODAL */}
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

            {editError && (
              <div className="text-red-600 text-sm">{editError}</div>
            )}

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
          }}
        >
          <div className="space-y-4">
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Nuvarande lösenord"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />

            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Nytt lösenord"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

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

      {/* ADD ROLE MODAL */}
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

      {/* ROLE MANAGER MODAL */}
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

/* ------------------------------
   GENERIC MODAL COMPONENT
------------------------------ */
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
