require('dotenv').config();
const mongoose = require('mongoose');
const { User, Court, Coach, Equipment, PricingRule } = require('./src/infrastructure/models/Schemas');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    await User.deleteMany({});
    await Court.deleteMany({});
    await Coach.deleteMany({});
    await Equipment.deleteMany({});
    await PricingRule.deleteMany({});

    const adminUser = new User({
      name: "Admin User",
      email: "admin@procourt.com",
      password: "admin123",
      role: "admin"
    });
    await adminUser.save();
    console.log("✅ Admin user created (email: admin@procourt.com, password: admin123)");

    const testUser = new User({
      name: "Test User",
      email: "user@procourt.com",
      password: "user123",
      role: "user"
    });
    await testUser.save();
    console.log("✅ Test user created (email: user@procourt.com, password: user123)");

    await Court.insertMany([
      { name: "Court 1 (Indoor)", type: "indoor", basePrice: 20, isActive: true },
      { name: "Court 2 (Indoor)", type: "indoor", basePrice: 20, isActive: true },
      { name: "Court 3 (Outdoor)", type: "outdoor", basePrice: 15, isActive: true },
      { name: "Court 4 (Outdoor)", type: "outdoor", basePrice: 15, isActive: true }
    ]);
    console.log("✅ Courts created");

    await Coach.insertMany([
      { name: "Coach Anjali", hourlyRate: 30, isAvailable: true, specialization: "Advanced Training" },
      { name: "Coach Vikram", hourlyRate: 25, isAvailable: true, specialization: "Beginners" },
      { name: "Coach David", hourlyRate: 35, isAvailable: true, specialization: "Professional" }
    ]);
    console.log("✅ Coaches created");

    await Equipment.insertMany([
      { name: "Professional Racket", totalStock: 10, hourlyRate: 5, isAvailable: true },
      { name: "Court Shoes", totalStock: 8, hourlyRate: 4, isAvailable: true }
    ]);
    console.log("✅ Equipment created");

    await PricingRule.insertMany([
      { 
        name: "Peak Hours (6-9 PM)", 
        ruleType: "peak", 
        multiplier: 1.5, 
        isActive: true,
        description: "50% surcharge during peak evening hours"
      },
      { 
        name: "Weekend Rate", 
        ruleType: "weekend", 
        multiplier: 1.3, 
        isActive: true,
        description: "30% surcharge on Saturdays and Sundays"
      },
      { 
        name: "Indoor Premium", 
        ruleType: "indoor_premium", 
        multiplier: 1.2, 
        isActive: true,
        description: "20% premium for indoor courts"
      }
    ]);
    console.log("✅ Pricing rules created");

    console.log("\n🎉 Database successfully seeded!");
    console.log("\n📧 Login Credentials:");
    console.log("   Admin: admin@procourt.com / admin123");
    console.log("   User:  user@procourt.com / user123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();