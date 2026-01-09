import Button from '@/components/Button'
import Input from '@/components/Input'
import OAuth from '@/components/OAuth'
import { icons, images } from '@/constants'
import { fetchAPI } from '@/lib/fetch'
import { useSignUp } from '@clerk/clerk-expo'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'
import { signUpSchema } from './_schemas'

const SignUp = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  })

  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
    data: {
      username: '',
      email: '',
    },
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const onSignUpPress = async (data: {
    username: string
    email: string
    password: string
  }) => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        username: data.username,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerification({
        ...verification,
        state: 'pending',
        data: {
          username: data.username,
          email: data.email,
        },
      })
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].longMessage)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      })

      if (signUpAttempt.status !== 'complete') {
        setVerification({
          ...verification,
          error: 'Verification failed',
          state: 'failed',
        })
        return
      }

      await fetchAPI('/(api)/user', {
        method: 'POST',
        body: JSON.stringify({
          username: verification.data.username,
          email: verification.data.email,
          clerkId: signUpAttempt.createdUserId,
        }),
      })

      await setActive({ session: signUpAttempt.createdSessionId })

      setVerification({
        ...verification,
        state: 'success',
      })
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: 'failed',
      })
    }
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />

          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>

        <View className="flex flex-col gap-6 p-6">
          <View className="flex flex-col">
            <View>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input
                    label="Username"
                    placeholder="Enter your username"
                    icon={icons.person}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.username && (
                <Text className="text-red-500 text-sm">
                  {errors.username.message}
                </Text>
              )}
            </View>
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    icon={icons.email}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm">
                  {errors.email.message}
                </Text>
              )}
            </View>
            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    icon={icons.lock}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={true}
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500 text-sm">
                  {errors.password.message}
                </Text>
              )}
            </View>
          </View>

          <Button title="Sign Up" onPress={handleSubmit(onSignUpPress)} />

          <OAuth />
        </View>

        {/* OAuth */}

        <Link
          href="/sign-in"
          className="text-lg text-center text-general-200 mt-10"
        >
          <Text>Already have an account</Text>{' '}
          <Text className="text-primary-500">Log In</Text>
        </Link>

        {/* Pending modal */}

        <ReactNativeModal
          isVisible={verification.state === 'pending'}
          onModalHide={() => {
            if (verification.state !== 'success') {
              return
            }

            setShowSuccessModal(true)
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>

            <Text className="font-Jakarta mb-5">
              We&apos;ve sent a verification code to your email address.
            </Text>

            <Input
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={code => setVerification({ ...verification, code })}
            />

            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}

            <Button
              title="Verify Email"
              onPress={onVerifyPress}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        {/* Verification modal */}

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />

            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>

            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>

            <Button
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false)

                router.push('/(root)/(tabs)/home')
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  )
}

export default SignUp
