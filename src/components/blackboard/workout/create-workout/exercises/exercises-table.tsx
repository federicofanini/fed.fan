"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { BODY_PARTS } from "@/app/exercises/config";
import { getExercises } from "@/app/exercises/actions";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";

const ITEMS_PER_PAGE = 20;
const DEBOUNCE_DELAY = 300;

export interface Exercise {
  id: string;
  name: string;
  body_part: string;
  target: string;
  equipment: string;
  secondary_muscles: string[];
  instructions: string[];
  gif_url: string;
}

interface ExercisesTableProps {
  exercises: Exercise[];
  selectedExercises?: Exercise[];
  onExerciseSelect?: (exercise: Exercise) => void;
  roundIndex?: number;
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Debounce function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function ExercisesTable({
  exercises: initialExercises,
  selectedExercises = [],
  onExerciseSelect = () => {},
  roundIndex = 0,
}: ExercisesTableProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByName, setSortByName] = useState(true);
  const [selectedExerciseDetails, setSelectedExerciseDetails] =
    useState<Exercise | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [bodyPart, setBodyPart] = useQueryState("bodyPart", {
    defaultValue: BODY_PARTS.BACK,
  });
  const offset = useRef(0);
  const isInitialMount = useRef(true);
  const loadingRef = useRef(false);

  const loadExercises = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoading(true);

    try {
      const result = await getExercises({
        bodyPart,
        limit: ITEMS_PER_PAGE,
        offset: offset.current,
      });

      if (!result?.data?.success || !result.data?.data) {
        throw new Error(result?.data?.error || "Failed to load exercises");
      }

      const { data, metadata } = result.data.data;

      const transformedExercises = data?.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        body_part: exercise.body_part,
        target: exercise.target,
        equipment: exercise.equipment,
        gif_url: exercise.gif_url,
        secondary_muscles: exercise.secondary_muscles,
        instructions: exercise.instructions,
      }));

      setExercises((prev: Exercise[]) => {
        return offset.current === 0
          ? transformedExercises ?? []
          : [...prev, ...(transformedExercises ?? [])];
      });

      const receivedCount = transformedExercises?.length ?? 0;
      setHasMore(
        receivedCount >= ITEMS_PER_PAGE && (metadata?.hasMore ?? false)
      );

      if (receivedCount > 0) {
        offset.current += ITEMS_PER_PAGE;
      }
    } catch (error) {
      console.error("Error loading exercises:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load exercises"
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        loadingRef.current = false;
      }, DEBOUNCE_DELAY);
    }
  }, [bodyPart, hasMore]);

  // Debounced version of loadExercises
  const debouncedLoadExercises = useCallback(
    debounce(() => {
      loadExercises();
    }, DEBOUNCE_DELAY),
    [loadExercises]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setExercises([]);
    setHasMore(true);
    offset.current = 0;
    loadingRef.current = false;
    debouncedLoadExercises();
  }, [bodyPart, debouncedLoadExercises]);

  // Debounced search handler
  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, DEBOUNCE_DELAY);

  const filteredExercises = exercises
    .filter((exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortByName
        ? a.name.localeCompare(b.name)
        : a.body_part.localeCompare(b.body_part)
    );

  const exercisesByBodyPart = filteredExercises.reduce((acc, exercise) => {
    const bodyPart = exercise.body_part;
    if (!acc[bodyPart]) {
      acc[bodyPart] = [];
    }
    acc[bodyPart].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const CategoryMenu = () => (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={bodyPart === BODY_PARTS.BACK}
          onClick={() => setBodyPart(BODY_PARTS.BACK)}
        >
          <a href="#">All Body Parts</a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {Object.values(BODY_PARTS).map((part) => (
        <SidebarMenuItem key={part}>
          <SidebarMenuButton
            asChild
            isActive={bodyPart === part}
            onClick={() => setBodyPart(part)}
          >
            <a href="#">{capitalize(part)}</a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">Select Exercises</Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden p-0 h-[90dvh] w-full max-w-full md:h-[700px] md:max-w-[900px] lg:max-w-[1000px]">
          <DialogTitle className="sr-only">Select Exercises</DialogTitle>
          <DialogDescription className="sr-only">
            Select exercises for your workout
          </DialogDescription>
          <SidebarProvider className="items-start">
            <Sidebar collapsible="none" className="hidden md:flex">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <CategoryMenu />
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <main className="flex h-full flex-1 flex-col overflow-hidden">
              <div className="flex items-center gap-2 p-4 border-b">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[240px] p-0">
                    <div className="py-4">
                      <CategoryMenu />
                    </div>
                  </SheetContent>
                </Sheet>

                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search exercises..."
                  className="flex-1"
                />
              </div>

              <div
                className="flex-1 overflow-y-auto px-2 md:px-4"
                id="scrollableDiv"
              >
                <InfiniteScroll
                  dataLength={exercises.length}
                  next={loadExercises}
                  hasMore={hasMore}
                  loader={
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  }
                  scrollableTarget="scrollableDiv"
                  endMessage={
                    exercises.length > 0 && (
                      <p className="text-center py-4 text-muted-foreground">
                        You&apos;ve seen all exercises for this body part
                      </p>
                    )
                  }
                >
                  {Object.entries(exercisesByBodyPart).map(
                    ([bodyPart, exercises]) => (
                      <div key={bodyPart} className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 capitalize">
                          {bodyPart}
                        </h2>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[30px]"></TableHead>
                              <TableHead className="w-[120px]"></TableHead>
                              <TableHead
                                className="cursor-pointer whitespace-nowrap"
                                onClick={() => setSortByName(!sortByName)}
                              >
                                Name <ArrowUpDown className="inline h-4 w-4" />
                              </TableHead>
                              <TableHead className="hidden md:table-cell whitespace-nowrap">
                                Target
                              </TableHead>
                              <TableHead className="hidden md:table-cell whitespace-nowrap">
                                Equipment
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {exercises.map((exercise) => (
                              <TableRow
                                key={exercise.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => {
                                  setSelectedExerciseDetails(exercise);
                                  setShowDetails(true);
                                }}
                              >
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                  <Checkbox
                                    checked={selectedExercises.some(
                                      (e) => e.id === exercise.id
                                    )}
                                    onCheckedChange={() =>
                                      onExerciseSelect(exercise)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Image
                                    width={80}
                                    height={80}
                                    src={exercise.gif_url}
                                    alt={exercise.name}
                                    className="size-20 object-cover rounded"
                                    unoptimized
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  <div>
                                    {capitalize(exercise.name)}
                                    <div className="flex flex-wrap gap-1 md:hidden mt-1">
                                      {exercise.secondary_muscles?.map(
                                        (muscle) => (
                                          <Badge
                                            key={muscle}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {capitalize(muscle)}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {capitalize(exercise.target)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {capitalize(exercise.equipment)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  )}
                </InfiniteScroll>
              </div>
            </main>
          </SidebarProvider>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-h-[90dvh] max-w-[95vw] md:max-w-3xl overflow-y-auto">
          <DialogTitle>
            {capitalize(selectedExerciseDetails?.name || "")}
          </DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Image
                width={300}
                height={300}
                src={selectedExerciseDetails?.gif_url || ""}
                alt={selectedExerciseDetails?.name || ""}
                className="w-full rounded-lg"
                unoptimized
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Body Part:</div>
                  <div>
                    {capitalize(selectedExerciseDetails?.body_part || "")}
                  </div>
                  <div className="text-muted-foreground">Target:</div>
                  <div>{capitalize(selectedExerciseDetails?.target || "")}</div>
                  <div className="text-muted-foreground">Equipment:</div>
                  <div>
                    {capitalize(selectedExerciseDetails?.equipment || "")}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secondary Muscles</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedExerciseDetails?.secondary_muscles.map((muscle) => (
                    <Badge key={muscle} variant="secondary">
                      {capitalize(muscle)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  {selectedExerciseDetails?.instructions.map(
                    (instruction, index) => (
                      <li key={index}>{instruction}</li>
                    )
                  )}
                </ol>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
