'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const countryCodes = [
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+91', flag: '🇮🇳' },
  { code: '+86', flag: '🇨🇳' },
  { code: '+81', flag: '🇯🇵' },
  // Add more country codes as needed
]

export default function PhoneVerification() {
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
  }

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input if current one is filled
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      otpRefs[index - 1].current?.focus()
    }
  }

  const handleVerifyOtp = () => {
    const otpValue = otp.join('')
    console.log('Verifying OTP:', otpValue)
    // Here you would typically send the OTP to your backend for verification
  }

  return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Phone Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="flex-1 ml-2"
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp-0">OTP</Label>
            <div className="flex space-x-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  ref={otpRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 text-center"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleVerifyOtp} className="w-full">Verify OTP</Button>
        </CardFooter>
      </Card>
  )
}