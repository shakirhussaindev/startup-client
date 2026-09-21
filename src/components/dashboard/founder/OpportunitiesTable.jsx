// components/dashboard/founder/OpportunitiesTable.jsx
"use client";

import { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Globe,
  Clock,
  Briefcase,
  Plus,
  X,
  Mail,
} from "lucide-react";
import {
  Button,
  AlertDialog,
  Modal,
  Input,
  Label,
  TextField,
  RadioGroup,
  Radio,
  Avatar,
} from "@heroui/react";

const SUGGESTED_SKILLS = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "TypeScript",
  "MongoDB",
  "UI/UX Design",
  "Product Management",
];

export default function OpportunitiesTable({ initialOpportunities = [] }) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);

  // Modal visibility states
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  // Form states for full update modal
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateSkills, setUpdateSkills] = useState([]);
  const [updateSkillInput, setUpdateSkillInput] = useState("");
  const [updateWorkType, setUpdateWorkType] = useState("remote");
  const [updateCommitment, setUpdateCommitment] = useState("full-time");
  const [updateDeadline, setUpdateDeadline] = useState("");

  // Open Details Modal
  const handleOpenDetails = (opp) => {
    setSelectedOpp(opp);
    setIsDetailsOpen(true);
  };

  // Open Update Modal and populate all existing fields
  const handleOpenUpdate = (opp) => {
    setSelectedOpp(opp);
    setUpdateTitle(opp.title || "");
    setUpdateSkills(Array.isArray(opp.skills) ? [...opp.skills] : []);
    setUpdateSkillInput("");
    setUpdateWorkType(opp.workType || "remote");
    setUpdateCommitment(opp.commitment || "full-time");
    setUpdateDeadline(opp.deadline || "");
    setIsUpdateOpen(true);
  };

  // Skill management in update modal
  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || updateSkillInput).trim();
    if (!trimmed) return;

    if (updateSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }

    setUpdateSkills([...updateSkills, trimmed]);
    setUpdateSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUpdateSkills(updateSkills.filter((s) => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Delete Handler
  const handleDeleteOpportunity = async (id) => {
    try {
      console.log("Deleting opportunity ID:", id);
      setOpportunities((prev) =>
        prev.filter((item) => (item._id || item.id) !== id),
      );
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
    }
  };

  // Update Submit Handler with dynamic status calculation
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const deadlineDate = new Date(updateDeadline);
    deadlineDate.setHours(23, 59, 59, 999);
    const calculatedStatus =
      deadlineDate.getTime() >= Date.now() ? "Active" : "Closed";

    const updatedData = {
      title: updateTitle,
      skills: updateSkills,
      workType: updateWorkType,
      commitment: updateCommitment,
      deadline: updateDeadline,
      status: calculatedStatus,
    };

    console.log("Updating opportunity ID:", selectedOpp?._id, updatedData);

    setOpportunities((prev) =>
      prev.map((item) =>
        (item._id || item.id) === (selectedOpp._id || selectedOpp.id)
          ? { ...item, ...updatedData }
          : item,
      ),
    );

    setIsUpdateOpen(false);
  };

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-default-200 bg-background/50 p-12 text-center dark:border-default-100/20">
        <Briefcase className="h-10 w-10 text-default-400" />
        <h3 className="mt-3 text-base font-semibold text-foreground">
          No opportunities found
        </h3>
        <p className="mt-1 text-xs text-default-500">
          You have not published any opportunities yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ================= OPPORTUNITIES TABLE ================= */}
      <div className="w-full overflow-hidden rounded-2xl border border-default-200/80 bg-background shadow-lg backdrop-blur-xl transition-colors dark:border-default-100/20 dark:bg-[#0d0d0f]/90">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left border-collapse">
            {/* Table Header with Colored Text & Subtle Background */}
            <thead className="border-b border-default-200/80 bg-default-100/60 dark:border-default-100/20 dark:bg-default-100/10">
              <tr className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                <th className="px-6 py-4">Role Title</th>
                <th className="px-6 py-4">Commitment</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-default-200/60 text-sm dark:divide-default-100/20">
              {opportunities.map((opp) => {
                const oppId = opp._id || opp.id;
                const isActive =
                  opp.status === "Active" || opp.status === "active";

                return (
                  <tr
                    key={oppId}
                    className="group transition-colors hover:bg-default-100/50 dark:hover:bg-default-100/20"
                  >
                    {/* 1. Role Title */}
                    <td className="px-6 py-4.5 font-bold text-foreground">
                      {opp.title}
                    </td>

                    {/* 2. Commitment */}
                    <td className="px-6 py-4.5 capitalize font-medium text-default-700 dark:text-default-300">
                      {opp.commitment || "Full-Time"}
                    </td>

                    {/* 3. Deadline */}
                    <td className="px-6 py-4.5 text-xs font-medium text-default-600 dark:text-default-400">
                      {opp.deadline || "No deadline"}
                    </td>

                    {/* 4. Status Badge */}
                    <td className="px-6 py-4.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {opp.status || (isActive ? "Active" : "Closed")}
                      </span>
                    </td>

                    {/* 5. Actions */}
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Details Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="View Details"
                          onPress={() => handleOpenDetails(opp)}
                          className="h-8 w-8 min-w-8 p-0 text-default-600 hover:bg-default-200/60 hover:text-foreground dark:text-default-400 dark:hover:bg-default-100/40 rounded-lg"
                        >
                          <Eye size={16} />
                        </Button>

                        {/* Update Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Edit Opportunity"
                          onPress={() => handleOpenUpdate(opp)}
                          className="h-8 w-8 min-w-8 p-0 text-default-600 hover:bg-default-200/60 hover:text-foreground dark:text-default-400 dark:hover:bg-default-100/40 rounded-lg"
                        >
                          <Pencil size={15} />
                        </Button>

                        {/* Delete Alert Dialog */}
                        <AlertDialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Delete Opportunity"
                            className="h-8 w-8 min-w-8 p-0 text-rose-600 hover:bg-rose-500/10 hover:text-rose-500 dark:text-rose-400 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </Button>

                          <AlertDialog.Backdrop>
                            <AlertDialog.Container>
                              <AlertDialog.Dialog className="sm:max-w-[420px] bg-background text-foreground">
                                <AlertDialog.CloseTrigger />
                                <AlertDialog.Header>
                                  <AlertDialog.Icon status="danger" />
                                  <AlertDialog.Heading>
                                    Delete this opportunity?
                                  </AlertDialog.Heading>
                                </AlertDialog.Header>
                                <AlertDialog.Body>
                                  <p className="text-sm text-default-600 dark:text-default-400">
                                    Are you sure you want to delete{" "}
                                    <strong>{opp.title}</strong>? All submitted
                                    candidate applications will be permanently
                                    removed.
                                  </p>
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                  <Button slot="close" variant="tertiary">
                                    Cancel
                                  </Button>
                                  <Button
                                    slot="close"
                                    variant="danger"
                                    onPress={() =>
                                      handleDeleteOpportunity(oppId)
                                    }
                                  >
                                    Delete Listing
                                  </Button>
                                </AlertDialog.Footer>
                              </AlertDialog.Dialog>
                            </AlertDialog.Container>
                          </AlertDialog.Backdrop>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= DETAILS MODAL ================= */}
      {selectedOpp && (
        <Modal isOpen={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-[560px] p-6 bg-background text-foreground">
                <Modal.CloseTrigger />

                <Modal.Header className="pb-4 border-b border-default-200/80 dark:border-default-100/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 rounded-xl ring-1 ring-default-200">
                      <Avatar.Image
                        src={
                          selectedOpp.startupLogo ||
                          selectedOpp.startup?.logo ||
                          "https://api.dicebear.com/7.x/identicon/svg?seed=StartupForge"
                        }
                        alt="Startup Logo"
                      />
                      <Avatar.Fallback>SF</Avatar.Fallback>
                    </Avatar>
                    <div>
                      <Modal.Heading className="text-xl font-bold text-foreground">
                        {selectedOpp.title}
                      </Modal.Heading>
                      <p className="text-xs text-default-500 dark:text-default-400">
                        {selectedOpp.startupName ||
                          selectedOpp.startup?.name ||
                          "StartupForge Labs"}{" "}
                        •{" "}
                        {selectedOpp.StartupIndustry ||
                          selectedOpp.startup?.industry ||
                          "Technology"}
                      </p>
                    </div>
                  </div>
                </Modal.Header>

                <Modal.Body className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                    <div className="rounded-xl border border-default-200/80 bg-default-100/50 p-3 dark:border-default-100/10 dark:bg-default-100/10">
                      <span className="flex items-center gap-1 text-default-500 dark:text-default-400">
                        <Globe size={13} /> Work Type
                      </span>
                      <p className="mt-1 font-semibold text-foreground capitalize">
                        {selectedOpp.workType}
                      </p>
                    </div>

                    <div className="rounded-xl border border-default-200/80 bg-default-100/50 p-3 dark:border-default-100/10 dark:bg-default-100/10">
                      <span className="flex items-center gap-1 text-default-500 dark:text-default-400">
                        <Clock size={13} /> Commitment
                      </span>
                      <p className="mt-1 font-semibold text-foreground capitalize">
                        {selectedOpp.commitment}
                      </p>
                    </div>

                    <div className="rounded-xl border border-default-200/80 bg-default-100/50 p-3 dark:border-default-100/10 dark:bg-default-100/10">
                      <span className="flex items-center gap-1 text-default-500 dark:text-default-400">
                        <Calendar size={13} /> Deadline
                      </span>
                      <p className="mt-1 font-semibold text-foreground">
                        {selectedOpp.deadline}
                      </p>
                    </div>

                    <div className="rounded-xl border border-default-200/80 bg-default-100/50 p-3 dark:border-default-100/10 dark:bg-default-100/10">
                      <span className="text-default-500 dark:text-default-400">
                        Status
                      </span>
                      <p
                        className={`mt-1 font-semibold ${
                          selectedOpp.status === "Active"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {selectedOpp.status}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-xl border border-default-200/80 bg-default-100/50 p-3 dark:border-default-100/10 dark:bg-default-100/10">
                      <span className="flex items-center gap-1 text-default-500 dark:text-default-400">
                        <Mail size={13} /> Founder Contact
                      </span>
                      <p className="mt-1 font-semibold text-foreground truncate">
                        {selectedOpp.founderEmail ||
                          selectedOpp.startup?.founderEmail ||
                          "founder@startupforge.dev"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-default-500 dark:text-default-400">
                      Required Skills
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedOpp.skills && selectedOpp.skills.length > 0 ? (
                        selectedOpp.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-default-400">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedOpp.createdAt && (
                    <p className="text-[11px] text-default-500 dark:text-default-400">
                      Published on{" "}
                      {new Date(selectedOpp.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    slot="close"
                    variant="secondary"
                    className="w-full !rounded-xl font-semibold"
                  >
                    Close Details
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      {/* ================= UPDATE MODAL ================= */}
      {selectedOpp && (
        <Modal isOpen={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-[580px] p-6 max-h-[90vh] flex flex-col bg-background text-foreground">
                <Modal.CloseTrigger />
                <Modal.Header className="pb-3 border-b border-default-200/80 dark:border-default-100/20">
                  <Modal.Heading className="text-lg font-bold text-foreground">
                    Update Opportunity
                  </Modal.Heading>
                  <p className="text-xs text-default-500 dark:text-default-400">
                    Modify listing details. Status will be calculated based on
                    deadline.
                  </p>
                </Modal.Header>

                <form
                  onSubmit={handleUpdateSubmit}
                  className="flex-1 overflow-y-auto"
                >
                  <Modal.Body className="space-y-5 py-4">
                    {/* 1. Role Title */}
                    <TextField isRequired name="title" className="w-full">
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Role Title <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={updateTitle}
                        onChange={(e) => setUpdateTitle(e.target.value)}
                        placeholder="e.g. Lead Full-Stack Co-Founder"
                        className="mt-1 w-full !rounded-xl"
                      />
                    </TextField>

                    {/* 2. Required Skills */}
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Required Skills <span className="text-rose-500">*</span>
                      </Label>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Type skill & press Enter"
                          value={updateSkillInput}
                          onChange={(e) => setUpdateSkillInput(e.target.value)}
                          onKeyDown={handleSkillKeyDown}
                          className="w-full !rounded-xl text-sm"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onPress={() => handleAddSkill()}
                          className="h-10 shrink-0 !rounded-xl px-4 text-xs font-semibold"
                        >
                          <Plus size={14} /> Add
                        </Button>
                      </div>

                      {updateSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {updateSkills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400"
                            >
                              <span>{skill}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="rounded-full hover:bg-orange-500/20"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 pt-1">
                        {SUGGESTED_SKILLS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleAddSkill(item)}
                            className="rounded-md border border-default-200 bg-default-100/60 px-2 py-0.5 text-[11px] font-medium text-default-600 hover:border-orange-500/40 hover:text-orange-600 dark:border-default-100/30 dark:bg-default-100/20 dark:text-default-400 dark:hover:text-orange-400"
                          >
                            + {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Work Type */}
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Work Type <span className="text-rose-500">*</span>
                      </Label>
                      <RadioGroup
                        value={updateWorkType}
                        onChange={setUpdateWorkType}
                        name="workType"
                        orientation="horizontal"
                        className="grid grid-cols-3 gap-2"
                      >
                        <Radio
                          value="remote"
                          className="cursor-pointer rounded-xl border border-default-200 p-2.5 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
                        >
                          <Radio.Content className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <Radio.Control>
                              <Radio.Indicator />
                            </Radio.Control>
                            <span>Remote</span>
                          </Radio.Content>
                        </Radio>

                        <Radio
                          value="hybrid"
                          className="cursor-pointer rounded-xl border border-default-200 p-2.5 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
                        >
                          <Radio.Content className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <Radio.Control>
                              <Radio.Indicator />
                            </Radio.Control>
                            <span>Hybrid</span>
                          </Radio.Content>
                        </Radio>

                        <Radio
                          value="onsite"
                          className="cursor-pointer rounded-xl border border-default-200 p-2.5 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
                        >
                          <Radio.Content className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <Radio.Control>
                              <Radio.Indicator />
                            </Radio.Control>
                            <span>Onsite</span>
                          </Radio.Content>
                        </Radio>
                      </RadioGroup>
                    </div>

                    {/* 4. Commitment Level */}
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Commitment Level{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <RadioGroup
                        value={updateCommitment}
                        onChange={setUpdateCommitment}
                        name="commitment"
                        orientation="horizontal"
                        className="grid grid-cols-3 gap-2"
                      >
                        <Radio
                          value="full-time"
                          className="cursor-pointer rounded-xl border border-default-200 p-2.5 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
                        >
                          <Radio.Content className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <Radio.Control>
                              <Radio.Indicator />
                            </Radio.Control>
                            <span>Full-time</span>
                          </Radio.Content>
                        </Radio>

                        <Radio
                          value="part-time"
                          className="cursor-pointer rounded-xl border border-default-200 p-2.5 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
                        >
                          <Radio.Content className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <Radio.Control>
                              <Radio.Indicator />
                            </Radio.Control>
                            <span>Part-time</span>
                          </Radio.Content>
                        </Radio>

                        <Radio
                          value="equity"
                          className="cursor-pointer rounded-xl border border-default-200 p-2.5 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
                        >
                          <Radio.Content className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <Radio.Control>
                              <Radio.Indicator />
                            </Radio.Control>
                            <span>Equity</span>
                          </Radio.Content>
                        </Radio>
                      </RadioGroup>
                    </div>

                    {/* 5. Deadline */}
                    <TextField
                      isRequired
                      name="deadline"
                      type="date"
                      className="w-full"
                    >
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Deadline <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={updateDeadline}
                        onChange={(e) => setUpdateDeadline(e.target.value)}
                        className="mt-1 w-full !rounded-xl"
                      />
                    </TextField>
                  </Modal.Body>

                  <Modal.Footer className="flex gap-2 border-t border-default-200/80 pt-3 dark:border-default-100/20">
                    <Button
                      slot="close"
                      variant="secondary"
                      className="flex-1 !rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 !rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md shadow-orange-500/20"
                    >
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </>
  );
}
