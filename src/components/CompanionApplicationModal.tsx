import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Upload, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// Form schema with validation
const formSchema = z.object({
  // Step 1: Basic Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').max(120, 'Invalid age'),
  location: z.string().min(2, 'Location is required'),
  gender: z.string().min(1, 'Gender is required'),
  
  // Step 2: Contact Details
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  whatsapp: z.string().optional(),
  
  // Step 3: Profile Details
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(1000, 'Bio must be less than 1000 characters'),
  hobbies: z.string().min(10, 'Please describe your hobbies'),
  services: z.string().min(10, 'Please describe your services'),
  
  // Step 4: Booking & Banking
  hourlyRate: z.coerce.number().min(100, 'Hourly rate must be at least R100'),
  overnightRate: z.coerce.number().min(500, 'Overnight rate must be at least R500'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  accountType: z.string().min(1, 'Account type is required'),
  branchCode: z.string().min(5, 'Branch code is required'),
  
  // Step 5: Availability - handled separately as arrays
  
  // Step 6: Media Upload - handled separately
});

type FormValues = z.infer<typeof formSchema>;

interface CompanionApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOTAL_STEPS = 7;

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const CompanionApplicationModal = ({ open, onOpenChange }: CompanionApplicationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [featuredMedia, setFeaturedMedia] = useState<File[]>([]);
  const [featuredMediaUrls, setFeaturedMediaUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  
  // Keep track of all URLs to revoke on unmount
  const urlsToCleanup = useRef<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      age: 18,
      location: '',
      gender: '',
      email: '',
      phone: '',
      whatsapp: '',
      bio: '',
      hobbies: '',
      services: '',
      hourlyRate: 0,
      overnightRate: 0,
      bankName: '',
      accountNumber: '',
      accountType: '',
      branchCode: '',
    },
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'age', 'location', 'gender'];
        break;
      case 2:
        fieldsToValidate = ['email', 'phone'];
        break;
      case 3:
        fieldsToValidate = ['bio', 'hobbies', 'services'];
        break;
      case 4:
        fieldsToValidate = ['hourlyRate', 'overnightRate', 'bankName', 'accountNumber', 'accountType', 'branchCode'];
        break;
      case 5:
        // Validate availability
        if (availableDays.length === 0) {
          toast.error('Please select at least one day of availability');
          return;
        }
        if (!startTime || !endTime) {
          toast.error('Please set your available time range');
          return;
        }
        if (startTime >= endTime) {
          toast.error('End time must be after start time');
          return;
        }
        setCurrentStep(currentStep + 1);
        return;
      case 6:
        // Validate media files
        if (!profilePicture) {
          toast.error('Please upload a profile picture');
          return;
        }
        if (featuredMedia.length < 3) {
          toast.error('Please upload at least 3 featured images/videos');
          return;
        }
        if (featuredMedia.length > 5) {
          toast.error('Please upload no more than 5 featured images/videos');
          return;
        }
        setCurrentStep(currentStep + 1);
        return;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Cleanup all object URLs on unmount
  useEffect(() => {
    return () => {
      urlsToCleanup.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // Ignore errors on cleanup
        }
      });
    };
  }, []);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Profile picture must be an image');
        return;
      }
      
      // Revoke old URL if exists
      if (profilePictureUrl) {
        URL.revokeObjectURL(profilePictureUrl);
        urlsToCleanup.current = urlsToCleanup.current.filter(url => url !== profilePictureUrl);
      }
      
      const newUrl = URL.createObjectURL(file);
      urlsToCleanup.current.push(newUrl);
      
      setProfilePicture(file);
      setProfilePictureUrl(newUrl);
    }
  };

  const handleFeaturedMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file sizes
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 10MB`);
        return;
      }
    }

    const totalFiles = featuredMedia.length + files.length;
    if (totalFiles > 5) {
      toast.error('You can upload a maximum of 5 featured images/videos');
      return;
    }

    const newUrls = files.map(file => {
      const url = URL.createObjectURL(file);
      urlsToCleanup.current.push(url);
      return url;
    });
    setFeaturedMedia([...featuredMedia, ...files]);
    setFeaturedMediaUrls([...featuredMediaUrls, ...newUrls]);
  };

  const removeFeaturedMedia = (index: number) => {
    // Revoke the URL for the removed file
    if (featuredMediaUrls[index]) {
      URL.revokeObjectURL(featuredMediaUrls[index]);
      urlsToCleanup.current = urlsToCleanup.current.filter(url => url !== featuredMediaUrls[index]);
    }
    
    setFeaturedMedia(featuredMedia.filter((_, i) => i !== index));
    setFeaturedMediaUrls(featuredMediaUrls.filter((_, i) => i !== index));
  };

  const handleDayToggle = (dayId: string) => {
    setAvailableDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      
      // Add availability data
      formData.append('availableDays', JSON.stringify(availableDays));
      formData.append('startTime', startTime);
      formData.append('endTime', endTime);
      
      // Add profile picture
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      
      // Add featured media
      featuredMedia.forEach((file, index) => {
        formData.append(`featuredMedia_${index}`, file);
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Show success step
      setCurrentStep(7);
      
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAttempt = () => {
    if (currentStep < 7) {
      setShowCloseConfirm(true);
    } else {
      handleClose(true);
    }
  };

  const handleClose = (confirmed: boolean) => {
    if (confirmed) {
      onOpenChange(false);
      // Reset form after a delay to allow for closing animation
      setTimeout(() => {
        form.reset();
        setCurrentStep(1);
        
        // Clean up object URLs
        if (profilePictureUrl) {
          URL.revokeObjectURL(profilePictureUrl);
          urlsToCleanup.current = urlsToCleanup.current.filter(url => url !== profilePictureUrl);
        }
        featuredMediaUrls.forEach(url => {
          URL.revokeObjectURL(url);
        });
        urlsToCleanup.current = urlsToCleanup.current.filter(url => !featuredMediaUrls.includes(url));
        
        setProfilePicture(null);
        setProfilePictureUrl(null);
        setFeaturedMedia([]);
        setFeaturedMediaUrls([]);
        setAvailableDays([]);
        setStartTime('09:00');
        setEndTime('17:00');
      }, 300);
    }
    setShowCloseConfirm(false);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={handleCloseAttempt}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {currentStep === 7 ? 'Application Submitted!' : 'Become a Cumpanion'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 7
              ? 'Thank you for your application'
              : `Step ${currentStep} of ${TOTAL_STEPS - 1}`}
          </DialogDescription>
        </DialogHeader>

        {currentStep < 7 && (
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="18" {...field} />
                      </FormControl>
                      <FormDescription>You must be at least 18 years old</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Johannesburg, Gauteng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="non-binary">Non-Binary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Details</h3>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="0821234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="0821234567" {...field} />
                      </FormControl>
                      <FormDescription>If different from phone number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Profile Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Details</h3>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum 50 characters, maximum 1000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hobbies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hobbies & Interests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What do you enjoy doing in your free time?"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Services Offered</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the companionship services you provide..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Booking & Banking */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Booking Rates & Banking Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate (ZAR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1000" {...field} />
                        </FormControl>
                        <FormDescription>Minimum R100</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overnightRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overnight Rate (ZAR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5000" {...field} />
                        </FormControl>
                        <FormDescription>Minimum R500</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Banking Details (South African Banks)</h4>

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your bank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="absa">ABSA Bank</SelectItem>
                            <SelectItem value="fnb">First National Bank (FNB)</SelectItem>
                            <SelectItem value="standard-bank">Standard Bank</SelectItem>
                            <SelectItem value="nedbank">Nedbank</SelectItem>
                            <SelectItem value="capitec">Capitec Bank</SelectItem>
                            <SelectItem value="discovery">Discovery Bank</SelectItem>
                            <SelectItem value="tymebank">TymeBank</SelectItem>
                            <SelectItem value="african-bank">African Bank</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="savings">Savings</SelectItem>
                            <SelectItem value="cheque">Cheque/Current</SelectItem>
                            <SelectItem value="transmission">Transmission</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="branchCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Code</FormLabel>
                        <FormControl>
                          <Input placeholder="123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Availability */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Availability</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Available Days *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={availableDays.includes(day.id)}
                          onCheckedChange={() => handleDayToggle(day.id)}
                        />
                        <label
                          htmlFor={day.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Select the days you're typically available
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Available From *
                    </label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Available Until *
                    </label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Set your typical availability hours. You can always adjust your schedule later from your dashboard.
                </p>
              </div>
            )}

            {/* Step 6: Media Upload */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile & Featured Media</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Profile Picture *
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {profilePicture && profilePictureUrl ? (
                        <div className="space-y-2">
                          <img
                            src={profilePictureUrl}
                            alt="Profile preview"
                            className="mx-auto h-32 w-32 object-cover rounded-full"
                          />
                          <p className="text-sm text-muted-foreground">{profilePicture.name}</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (profilePictureUrl) {
                                URL.revokeObjectURL(profilePictureUrl);
                                urlsToCleanup.current = urlsToCleanup.current.filter(url => url !== profilePictureUrl);
                              }
                              setProfilePicture(null);
                              setProfilePictureUrl(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Upload your profile picture
                          </p>
                          <p className="text-xs text-muted-foreground">Maximum 10MB</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="mt-4"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Featured Images/Videos * (3-5 required)
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-6">
                      <div className="text-center mb-4">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Upload 3-5 featured images or videos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Maximum 10MB per file
                        </p>
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFeaturedMediaChange}
                          className="mt-4"
                          disabled={featuredMedia.length >= 5}
                        />
                      </div>

                      {featuredMedia.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {featuredMedia.map((file, index) => (
                            <div key={index} className="relative group">
                              {file.type.startsWith('image/') ? (
                                <img
                                  src={featuredMediaUrls[index]}
                                  alt={`Featured ${index + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                              ) : (
                                <div className="w-full h-24 bg-muted rounded flex items-center justify-center">
                                  <span className="text-xs text-center">Video</span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeFeaturedMedia(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <p className="text-xs truncate mt-1">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-center mt-4">
                        {featuredMedia.length} of 3-5 files uploaded
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Thank You */}
            {currentStep === 7 && (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold text-foreground">
                  Application Submitted Successfully!
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thank you for your application! An account manager will review your submission
                  and respond with further instructions to activate your account within 3-5 business days.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your email for confirmation and next steps.
                </p>
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="mt-4"
                >
                  Close
                </Button>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 7 && (
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>

                {currentStep < 6 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    
    <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Application Form?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to close? Your progress will be lost and you'll need to start over.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClose(false)}>
            Continue Application
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleClose(true)}>
            Close Form
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default CompanionApplicationModal;
