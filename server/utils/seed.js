const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const RFQ = require('../models/RFQ');
const Quotation = require('../models/Quotation');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/b2b_rfq_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Quotation.deleteMany({});
    await RFQ.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing database records.');

    // 1. Create Users
    const buyer1 = await User.create({
      name: 'John Buyer',
      email: 'buyer@market.com',
      password: 'password123',
      role: 'buyer',
      companyName: 'Apex Manufacturing Ltd.',
      phone: '+1 (555) 234-5678'
    });

    const supplier1 = await User.create({
      name: 'Sarah Supplier',
      email: 'supplier@market.com',
      password: 'password123',
      role: 'supplier',
      companyName: 'Precision Metal Works Inc.',
      phone: '+1 (555) 876-5432'
    });

    const supplier2 = await User.create({
      name: 'Michael Vendor',
      email: 'supplier2@market.com',
      password: 'password123',
      role: 'supplier',
      companyName: 'Global Polymer & Hardware Solutions',
      phone: '+1 (555) 432-1098'
    });

    console.log('Users created:');
    console.log('  Buyer:    buyer@market.com / password123');
    console.log('  Supplier: supplier@market.com / password123');
    console.log('  Supplier: supplier2@market.com / password123');

    // 2. Create RFQs
    const now = new Date();
    const inDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const rfq1 = await RFQ.create({
      title: 'Industrial Grade Stainless Steel Hex Screws (M6 x 20mm)',
      description: 'Looking for 316-grade marine stainless steel hex cap screws. Must meet ISO 4017 standard. Certificates of conformity required with shipment.',
      quantity: 5000,
      unit: 'pieces',
      deliveryLocation: 'Chicago, IL (Warehouse Facility B)',
      deadline: inDays(14),
      status: 'open',
      buyer: buyer1._id
    });

    const rfq2 = await RFQ.create({
      title: 'High-Density Polyethylene Sheets (10mm thick, 4x8 ft)',
      description: 'UV-resistant black HDPE sheets for heavy industrial lining. Smooth finish on both sides. Immediate shipment required upon bid acceptance.',
      quantity: 250,
      unit: 'sheets',
      deliveryLocation: 'Dallas, TX (Industrial Logistics Hub)',
      deadline: inDays(7),
      status: 'open',
      buyer: buyer1._id
    });

    const rfq3 = await RFQ.create({
      title: 'CNC Precision Machined 6061-T6 Aluminum Mounting Brackets',
      description: 'Custom machined brackets per CAD drawings (spec sheet attached upon request). Clear anodized finish, tight tolerance (+/- 0.05mm).',
      quantity: 1200,
      unit: 'units',
      deliveryLocation: 'Detroit, MI (Assembly Plant 4)',
      deadline: inDays(21),
      status: 'open',
      buyer: buyer1._id
    });

    const rfq4 = await RFQ.create({
      title: 'Heavy Duty Double-Wall Corrugated Packaging Boxes',
      description: 'Custom sized 24x18x18 inch corrugated shipping boxes with company logo single-color print. Burst test strength minimum 275 lbs/sq inch.',
      quantity: 10000,
      unit: 'boxes',
      deliveryLocation: 'Atlanta, GA (Fulfillment Center)',
      deadline: inDays(3),
      status: 'open',
      buyer: buyer1._id
    });

    const rfq5 = await RFQ.create({
      title: 'Heavy Duty Industrial Hydraulic Pumps (Model HP-450)',
      description: 'Variable displacement axial piston pumps for high-pressure hydraulic presses. Standard SAE flange mounting.',
      quantity: 15,
      unit: 'units',
      deliveryLocation: 'Houston, TX (Fabrication Plant)',
      deadline: inDays(-2), // Expired deadline
      status: 'closed',
      buyer: buyer1._id
    });

    console.log(`Created 5 sample RFQs.`);

    // 3. Create Quotations for RFQ 1
    await Quotation.create({
      rfq: rfq1._id,
      supplier: supplier1._id,
      price: 3250.00,
      estimatedDeliveryTime: '5 business days',
      notes: 'Includes full material test reports (MTR), mil-spec certification, and palletized export packaging.'
    });

    await Quotation.create({
      rfq: rfq1._id,
      supplier: supplier2._id,
      price: 3100.00,
      estimatedDeliveryTime: '7 business days',
      notes: 'Direct from our Midwest distribution center with free dock-to-dock freight included.'
    });

    // Quotation for RFQ 2
    await Quotation.create({
      rfq: rfq2._id,
      supplier: supplier2._id,
      price: 8750.00,
      estimatedDeliveryTime: '4 business days',
      notes: 'Prime virgin grade resin HDPE, cut to exact dimensions, protective plastic masking on both sides.'
    });

    console.log('Created sample quotations.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
